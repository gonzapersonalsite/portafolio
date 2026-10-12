// @vitest-environment node
import { readFileSync } from 'node:fs'
import { ESLint, type Linter } from 'eslint'
import { beforeAll, describe, expect, it } from 'vitest'

// Each architecture rule of eslint.config.js, seen firing on the smallest file
// that breaks it, and seen silent on files that keep to it: relaxing a rule
// turns its case red here, not only in a review.
const eslint = new ESLint({ cwd: import.meta.dirname })

// The first lint loads eslint.config.js, its plugins and the parser: a cold start of
// seconds that would otherwise count against the first case's 5 s timeout.
beforeAll(async () => {
  await eslint.lintText('', { filePath: 'src/app/warmup.ts' })
}, 30_000)

async function lint(path: string, code: string): Promise<Linter.LintMessage[]> {
  const [result] = await eslint.lintText(code, { filePath: path })
  return result.messages
}

// The rule of a report, or its text when it has none (a parsing error, an ignored comment).
const ruleOf = (message: Linter.LintMessage): string => message.ruleId ?? message.message

// Errors only: a rule lowered to a warning no longer breaks the file, and its case turns red.
async function rulesBrokenBy(path: string, code: string): Promise<string[]> {
  const messages = await lint(path, code)
  return messages.filter((message) => message.severity === 2).map(ruleOf)
}

// Every report, warnings included: a warning is red too, so a file that keeps
// to the rules gets none.
async function reportsOn(path: string, code: string): Promise<string[]> {
  const messages = await lint(path, code)
  return messages.map(ruleOf)
}

describe('the layers of Feature-Sliced Design', () => {
  it.each([
    [
      'a layer importing from a layer above it',
      'src/entities/project/model/contact.ts',
      "import { ContactForm } from '@/features/contact-form'\nexport const form = ContactForm\n",
      'fsd/forbidden-imports',
    ],
    [
      'a slice importing a sibling of its own layer',
      'src/features/contact-form/model/theme.ts',
      "import { useColorMode } from '@/features/theme-switch'\nexport const mode = useColorMode\n",
      'fsd/no-cross-slice-dependency',
    ],
    [
      'a relative import that leaves its slice',
      'src/features/contact-form/ui/Picker.tsx',
      "import { ProjectCard } from '../../../entities/project'\nexport const Card = ProjectCard\n",
      'fsd/no-relative-imports',
    ],
    [
      'a deep import into a slice',
      'src/pages/home/ui/Board.tsx',
      "import { PROJECT_LINK_KINDS } from '@/entities/project/model/projectLinks'\nexport const kinds = PROJECT_LINK_KINDS\n",
      'fsd/no-public-api-sidestep',
    ],
    [
      'an import of a segment instead of the slice',
      'src/pages/home/ui/Board.tsx',
      "import { getAllProjects } from '@/entities/project/api'\nexport const projects = getAllProjects\n",
      'fsd/no-public-api-sidestep',
    ],
    [
      'a deep import into a feature',
      'src/pages/contact/ui/Board.tsx',
      "import ContactForm from '@/features/contact-form/ui/ContactForm'\nexport const Form = ContactForm\n",
      'fsd/no-public-api-sidestep',
    ],
    [
      'a deep import into a widget',
      'src/pages/home/ui/Board.tsx',
      "import { Navbar } from '@/widgets/navbar/ui/Navbar'\nexport const Bar = Navbar\n",
      'fsd/no-public-api-sidestep',
    ],
    [
      'a deep import into a page',
      'src/app/routing/Shell.tsx',
      "import HomePage from '@/pages/home/ui/HomePage'\nexport const Page = HomePage\n",
      'fsd/no-public-api-sidestep',
    ],
    ['a folder of src that is not a layer', 'src/services/api.ts', 'export const api = 1\n', 'no-restricted-syntax'],
    [
      'a file at the root of src',
      'src/utils.ts',
      'export const twice = (n: number) => n * 2\n',
      'no-restricted-syntax',
    ],
    [
      'the entry point at the root of src',
      'src/main.tsx',
      "import { createRoot } from 'react-dom/client'\nexport const root = createRoot\n",
      'no-restricted-syntax',
    ],
    [
      'ambient declarations at the root of src',
      'src/vite-env.d.ts',
      'declare const __APP_VERSION__: string\n',
      'no-restricted-syntax',
    ],
  ])('rejects %s', async (_case, path, code, rule) => {
    expect(await rulesBrokenBy(path, code)).toContain(rule)
  })

  it.each(['js', 'jsx', 'mjs', 'cjs', 'mts', 'cts'])(
    'rejects code in a .%s file, which none of the rules would read',
    async (extension) => {
      // A statement that every module system parses: a .cjs file rejects export.
      expect(await rulesBrokenBy(`src/entities/project/model/legacy.${extension}`, 'const legacy = 1\n')).toContain(
        'no-restricted-syntax',
      )
    },
  )

  it('accepts imports that go down the layers through each public API', async () => {
    const code =
      "import { ProjectCard } from '@/entities/project'\nimport { ContactForm } from '@/features/contact-form'\nimport { useContent } from '@/shared/lib'\nexport const parts = [ProjectCard, ContactForm, useContent]\n"

    expect(await reportsOn('src/pages/home/ui/Board.tsx', code)).toEqual([])
  })

  it('accepts the entry point inside app, importing its own segments relatively', async () => {
    const code =
      "import { AppProviders } from './providers'\nimport AppRouter from './routing/AppRouter'\nimport './styles/index.css'\nexport const parts = [AppProviders, AppRouter]\n"

    expect(await reportsOn('src/app/main.tsx', code)).toEqual([])
  })

  it('leaves a test free of the import rules of the layers', async () => {
    // A layer above, a sibling slice, a deep import and a relative path out of the slice.
    const code =
      "import { Navbar } from '@/widgets/navbar'\nimport { useColorMode } from '@/features/theme-switch'\nimport { PROJECT_LINK_KINDS } from '@/entities/project/model/projectLinks'\nimport { ProjectCard } from '../../../entities/project'\nexport const parts = [Navbar, useColorMode, PROJECT_LINK_KINDS, ProjectCard]\n"

    expect(await reportsOn('src/features/contact-form/ui/ContactForm.extra.test.tsx', code)).toEqual([])
  })
})

describe('build-time code outside src', () => {
  it.each([
    [
      'the tooling reading the content it publishes',
      'tooling/agent-files/llmsTxt.ts',
      "import { getAllProjects } from '../../src/entities/project/api/projectApi.ts'\nexport const projects = getAllProjects\n",
    ],
    [
      'the build configuration loading the tooling',
      'vite.config.ts',
      "import { agentFilesPlugin } from './tooling/agent-files/vitePlugin.ts'\nexport const plugin = agentFilesPlugin\n",
    ],
  ])('leaves the layer rules to src: accepts %s', async (_case, path, code) => {
    expect(await reportsOn(path, code)).toEqual([])
  })
})

describe('no UI in the model, api and lib segments', () => {
  it.each([
    ['a .tsx file', 'src/entities/project/model/view.tsx', 'export const view = 1\n', 'no-restricted-syntax'],
    [
      'an import of its slice ui',
      'src/features/contact-form/model/form.ts',
      "import ContactForm from '../ui/ContactForm'\nexport const form = ContactForm\n",
      'no-restricted-imports',
    ],
    [
      'an import of the shared ui',
      'src/features/contact-form/api/notify.ts',
      "import { StatusBadge } from '@/shared/ui'\nexport const badge = StatusBadge\n",
      'no-restricted-imports',
    ],
    [
      'an import of react-dom',
      'src/entities/project/model/portal.ts',
      "import { createPortal } from 'react-dom'\nexport const portal = createPortal\n",
      'no-restricted-imports',
    ],
    [
      'an import of react-dom/client',
      'src/entities/project/model/root.ts',
      "import { createRoot } from 'react-dom/client'\nexport const root = createRoot\n",
      'no-restricted-imports',
    ],
    [
      'an import of react-dom/server',
      'src/entities/project/model/html.ts',
      "import { renderToString } from 'react-dom/server'\nexport const html = renderToString\n",
      'no-restricted-imports',
    ],
    [
      'the JSX runtime',
      'src/entities/project/model/runtime.ts',
      "import { jsx } from 'react/jsx-runtime'\nexport const element = jsx('p', {})\n",
      'no-restricted-imports',
    ],
    [
      'the JSX dev runtime',
      'src/entities/project/model/runtime.ts',
      "import { jsxDEV } from 'react/jsx-dev-runtime'\nexport const element = jsxDEV\n",
      'no-restricted-imports',
    ],
    [
      'an element created without JSX',
      'src/entities/project/model/element.ts',
      "import { createElement } from 'react'\nexport const element = createElement('p')\n",
      'no-restricted-imports',
    ],
    [
      'an element cloned without JSX',
      'src/entities/project/lib/clone.ts',
      "import { cloneElement } from 'react'\nexport const clone = cloneElement\n",
      'no-restricted-imports',
    ],
    [
      'React as a default import',
      'src/entities/project/model/element.ts',
      "import React from 'react'\nexport const element = React.createElement('p')\n",
      'no-restricted-imports',
    ],
    [
      'React as a namespace',
      'src/entities/project/model/element.ts',
      "import * as React from 'react'\nexport const element = React.createElement('p')\n",
      'no-restricted-imports',
    ],
    [
      'a component of the UI kit',
      'src/features/contact-form/model/button.ts',
      "import { Button } from '@mui/material'\nexport const Submit = Button\n",
      'no-restricted-imports',
    ],
    [
      'a type of the UI kit',
      'src/shared/lib/severity.ts',
      "import type { AlertColor } from '@mui/material'\nexport type Severity = AlertColor\n",
      'no-restricted-imports',
    ],
    [
      'an icon of the UI kit',
      'src/shared/lib/icon.ts',
      "import SendIcon from '@mui/icons-material/Send'\nexport const icon = SendIcon\n",
      'no-restricted-imports',
    ],
    [
      'a styled component',
      'src/entities/project/lib/card.ts',
      "import { styled } from '@mui/material/styles'\nexport const Card = styled('div')({ padding: 8 })\n",
      'no-restricted-imports',
    ],
    [
      'an Emotion styled component',
      'src/shared/lib/card.ts',
      "import styled from '@emotion/styled'\nexport const Card = styled.div({ padding: 8 })\n",
      'no-restricted-imports',
    ],
    [
      'a dynamic import of the UI kit',
      'src/features/contact-form/api/lazy.ts',
      "export const load = () => import('@mui/material')\n",
      'no-restricted-syntax',
    ],
    [
      'a dynamic import of its slice ui',
      'src/features/contact-form/model/lazy.ts',
      "export const load = () => import('../ui/ContactForm')\n",
      'no-restricted-syntax',
    ],
    [
      'a dynamic import of react-dom',
      'src/features/contact-form/api/lazy.ts',
      "export const load = () => import('react-dom/client')\n",
      'no-restricted-syntax',
    ],
    [
      'a dynamic import of the JSX runtime',
      'src/app/layouts/lib/lazy.ts',
      "export const load = () => import('react/jsx-runtime')\n",
      'no-restricted-syntax',
    ],
    [
      'a dynamic import of styles',
      'src/shared/lib/lazy.ts',
      "export const load = () => import('./theme.module.css')\n",
      'no-restricted-syntax',
    ],
    [
      'a dynamic import of React, which brings it as a whole',
      'src/entities/project/model/lazy.ts',
      "export const load = () => import('react')\n",
      'no-restricted-syntax',
    ],
  ])('rejects %s', async (_case, path, code, rule) => {
    expect(await rulesBrokenBy(path, code)).toContain(rule)
  })

  it.each(['css', 'scss', 'sass', 'less', 'styl', 'stylus', 'pcss', 'postcss', 'sss', 'css?inline'])(
    'rejects an import of .%s styles',
    async (extension) => {
      const code = `import styles from './theme.module.${extension}'\nexport const theme = styles\n`

      expect(await rulesBrokenBy('src/entities/project/lib/theme.ts', code)).toContain('no-restricted-imports')
    },
  )

  it('sees both the .tsx file and its dynamic import of UI', async () => {
    const broken = await rulesBrokenBy(
      'src/features/contact-form/model/lazy.tsx',
      "export const load = () => import('../ui/ContactForm')\n",
    )

    expect(broken.filter((rule) => rule === 'no-restricted-syntax')).toHaveLength(2)
  })

  it.each([
    [
      'logic that uses React state and its own model',
      'src/entities/project/model/useCover.ts',
      "import { useState } from 'react'\nimport { projectCoverSources } from './projectImages'\nexport const parts = [useState, projectCoverSources]\n",
    ],
    [
      'an api segment reading its static content',
      'src/entities/project/api/projectApi.ts',
      "import projectsData from './data.json' with { type: 'json' }\nexport const projects = projectsData\n",
    ],
    [
      'the api segment loading the EmailJS SDK',
      'src/features/contact-form/api/contactApi.ts',
      "export const load = () => import('@emailjs/browser')\n",
    ],
  ])('accepts %s', async (_case, path, code) => {
    expect(await reportsOn(path, code)).toEqual([])
  })

  it('leaves the tests of those segments free to render', async () => {
    const code =
      "import { render } from '@testing-library/react'\nimport ProjectCard from '../ui/ProjectCard'\nimport { getAllProjects } from '../api/projectApi'\nexport const draw = () => render(<ProjectCard project={getAllProjects()[0]} />)\n"

    expect(await reportsOn('src/entities/project/model/projectImages.view.test.tsx', code)).toEqual([])
  })
})

describe('no request of its own from src', () => {
  it.each([
    ['fetch', "export const send = () => fetch('/contact')\n", 'no-restricted-globals'],
    ['XMLHttpRequest', 'export const open = () => new XMLHttpRequest()\n', 'no-restricted-globals'],
    ['window.fetch', "export const send = () => window.fetch('/contact')\n", 'no-restricted-properties'],
    ['globalThis.fetch', "export const send = () => globalThis.fetch('/contact')\n", 'no-restricted-properties'],
    ['self.fetch', "export const send = () => self.fetch('/contact')\n", 'no-restricted-properties'],
  ])('rejects %s, even in the api segment that sends the contact message', async (_case, code, rule) => {
    expect(await rulesBrokenBy('src/features/contact-form/api/contactApi.ts', code)).toContain(rule)
  })

  it.each([
    ['a component', 'src/pages/contact/ui/ContactPage.tsx'],
    ['a shared helper', 'src/shared/lib/storage.ts'],
  ])('rejects fetch in %s too', async (_case, path) => {
    expect(await rulesBrokenBy(path, "export const send = () => fetch('/contact')\n")).toContain('no-restricted-globals')
  })

  it('leaves tests free to stub the network', async () => {
    const code = "import { expect, it } from 'vitest'\nit('stubs', () => expect(typeof fetch).toBe('function'))\n"

    expect(await reportsOn('src/shared/lib/storage.extra.test.ts', code)).toEqual([])
  })

  it('rejects fetch in src/shared/api too: the site has no HTTP client to exempt', async () => {
    const code = "export const load = () => fetch('/projects')\n"

    expect(await rulesBrokenBy('src/shared/api/transport.ts', code)).toContain('no-restricted-globals')
  })
})

describe('every test runs', () => {
  it.each([
    ['it.skip', "import { it } from 'vitest'\nit.skip('waits', () => {})\n"],
    ['describe.skip', "import { describe } from 'vitest'\ndescribe.skip('waits', () => {})\n"],
    ['it.todo', "import { it } from 'vitest'\nit.todo('later')\n"],
    ['test.skipIf', "import { test } from 'vitest'\ntest.skipIf(true)('waits', () => {})\n"],
    ['it.runIf', "import { it } from 'vitest'\nit.runIf(false)('waits', () => {})\n"],
    ['a skip from inside the test', "import { it } from 'vitest'\nit('waits', (context) => context.skip())\n"],
  ])('rejects %s', async (_case, code) => {
    expect(await rulesBrokenBy('src/entities/project/model/projectImages.extra.test.ts', code)).toContain(
      'no-restricted-properties',
    )
  })

  it('rejects a skipped test of the tooling too', async () => {
    const code = "import { it } from 'vitest'\nit.skip('waits', () => {})\n"

    expect(await rulesBrokenBy('tooling/agent-files/twins.extra.test.ts', code)).toContain('no-restricted-properties')
  })
})

describe('exceptions live in the configuration', () => {
  it('does not let a comment switch a rule off, and warns about the comment', async () => {
    const code = "/* eslint-disable */\nimport { createPortal } from 'react-dom'\nexport const portal = createPortal\n"

    const messages = await lint('src/entities/project/model/portal.ts', code)

    expect(messages).toContainEqual(expect.objectContaining({ ruleId: 'no-restricted-imports', severity: 2 }))
    expect(messages).toContainEqual(
      expect.objectContaining({ ruleId: null, severity: 1, message: expect.stringContaining("'noInlineConfig'") }),
    )
  })

  it('counts a warning as an error in the lint and the pre-commit hook', () => {
    const manifest = JSON.parse(readFileSync(new URL('./package.json', import.meta.url), 'utf8'))

    const commands = [manifest.scripts.lint, manifest['lint-staged']['*.{ts,tsx}']]

    expect(commands.every((command?: string) => command?.includes('--max-warnings=0'))).toBe(true)
  })
})
