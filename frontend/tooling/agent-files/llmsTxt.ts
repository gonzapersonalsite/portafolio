import { getProfile } from '../../src/entities/profile/api/profileApi.ts';
import { getAllProjects } from '../../src/entities/project/api/projectApi.ts';
import { getLocalizedText } from '../../src/shared/lib/getLocalizedText.ts';
import { TWIN_LABELS } from './labels.ts';
import { richTextToBlocks } from './richText.ts';
import { absoluteUrl, ROUTES, twinPathOf, type Locale } from './routes.ts';

const pageList = (locale: Locale): string =>
  ROUTES.map(
    (route) => `- [${TWIN_LABELS[locale].nav[route.id]}](${absoluteUrl(twinPathOf(route, locale))})`,
  ).join('\n');

export const buildLlmsTxt = (): string => {
  const profile = getProfile();
  const english = TWIN_LABELS.en;
  const projects = getAllProjects()
    .map((project) => {
      const title = getLocalizedText('en', project.titleEn, project.titleEs);
      const link = project.liveUrl ?? project.githubUrl;
      return link === undefined ? `- ${title}` : `- [${title}](${link})`;
    })
    .join('\n');

  return [
    `# ${profile.fullNameEn}`,
    '',
    `> ${profile.subtitleEn}`,
    '',
    ...richTextToBlocks(profile.descriptionEn),
    '',
    `Based in ${profile.locationEn}. Every page has an English markdown version and a Spanish one, listed below.`,
    '',
    `## ${english.pages}`,
    pageList('en'),
    '',
    `## ${english.projectsHeading}`,
    projects,
    '',
    '## Español',
    pageList('es'),
    '',
    `## ${english.contactHeading}`,
    `- ${english.contactEmail}: ${profile.email}`,
    `- GitHub: ${profile.githubUrl}`,
    `- LinkedIn: ${profile.linkedinUrl}`,
    '',
  ].join('\n');
};
