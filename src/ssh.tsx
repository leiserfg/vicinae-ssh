import React, { useState, useMemo, useEffect } from 'react';
import { Action, ActionPanel, Icon, List, showToast, getPreferenceValues } from '@vicinae/api';

export default function ControlledList() {
  // search is explicitly controlled by state
  const [searchText, setSearchText] = useState('');
  const [hosts, setHosts] = useState([]);
  const {executor} = getPreferenceValues();
  useEffect(()=>{
    getSshHostsFromConfig().then(setHosts)
  },[])

const filterHosts = (query: string, hosts: string[]) => {
  let filtered = hosts.filter(h => h.toLowerCase().includes(query.toLowerCase()));
  if (filtered.length === 0) {
    const trimmedQuery = query.trim();
    return [{ title: `ssh "${trimmedQuery}"`, host: trimmedQuery, subtitle: 'fallback' }];
  }
  return filtered.map(h => ({ title: `ssh ${h}`, host: h, subtitle: '' }));
}

  const filteredHosts = useMemo(() => filterHosts(searchText, hosts), [searchText, hosts]);

  return (
    <List searchText={searchText} onSearchTextChange={setSearchText} searchBarPlaceholder={'Search hosts...'}>
      <List.Section title={'Hosts'}>
        {filteredHosts.map(host => (
          <List.Item
            key={host.host}
            title={host.title}
            subtitle={host.subtitle}
            icon={Icon.Terminal}
            actions={
                <ActionPanel>
                  <Action title="Open" icon={Icon.Cog} onAction={() => {
                    showToast({ title: `Running ${executor} ${host.host}`});
                    executeCommand(`${executor} ${host.host}`)
                  }} />
                </ActionPanel>
            }
          />
        ))}
      </List.Section>
    </List>
  );
}

import fs from 'fs';
import os from 'os';

/**
 * Reads ~/.ssh/config and returns a Promise of host names defined there.
 */
export async function getSshHostsFromConfig(): Promise<string[]> {
  const sshConfigPath = `${os.homedir()}/.ssh/config`;
  try {
    const content = await fs.promises.readFile(sshConfigPath, 'utf8');
    const lines = content.split('\n');
    const hosts: string[] = [];
    for (const line of lines) {
      const trimmed = line.trim();
      if (trimmed.startsWith('Host ')) {
        const hostnames = trimmed.slice(5).trim().split(/\s+/);
        for (const h of hostnames) {
          if (h !== '*' && h.length > 0) {
            hosts.push(h);
          }
        }
      }
    }
    return hosts;
  } catch (err) {
    // File not found or unreadable
    return [];
  }
}


import { exec } from "node:child_process";
import { promisify } from "node:util";
import { showToast } from "@vicinae/api";

const execAsync = promisify(exec);

export interface ExecOptions {
  timeout?: number;
  cwd?: string;
  env?: NodeJS.ProcessEnv;
}

export interface ExecResult {
  success: boolean;
  stdout: string;
  stderr: string;
  error?: string;
}

/**
 * Execute a shell command with proper error handling
 */
export async function executeCommand(
  command: string,
  options: ExecOptions = {}
): Promise<ExecResult> {
  try {
    const { stdout, stderr } = await execAsync(command, {
      timeout: options.timeout || 30000, // 30 second default timeout
      cwd: options.cwd,
      env: options.env,
    });

    return {
      success: true,
      stdout: stdout.trim(),
      stderr: stderr.trim(),
    };
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : "Unknown command error";

    return {
      success: false,
      stdout: "",
      stderr: errorMessage,
      error: errorMessage,
    };
  }
}
