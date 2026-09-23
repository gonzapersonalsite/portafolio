import type { Experience } from '../../src/entities/experience/model/types';
import type { Project } from '../../src/entities/project/model/types';
import { getAllExperiences } from '../../src/entities/experience/api/experienceApi';
import { getProfile } from '../../src/entities/profile/api/profileApi';
import { getAllProjects, getFeaturedProjects } from '../../src/entities/project/api/projectApi';
import { getAllSkills } from '../../src/entities/skill/api/skillApi';
import { getAllSpokenLanguages } from '../../src/entities/spoken-language/api/languageApi';
import { getLocalizedText } from '../../src/shared/lib/getLocalizedText';
import { TWIN_LABELS, type TwinLabels } from './labels';
import { richTextToBlocks } from './richText';
import { ROUTES, twinPathOf, type Locale, type RouteId } from './routes';

const join = (blocks: readonly string[]): string =>
  blocks.filter((block) => block.length > 0).join('\n\n');

const finish = (markdown: string): string => `${markdown}\n`;

const technologiesLine = (labels: TwinLabels, technologies: readonly string[]): string =>
  technologies.length === 0
    ? ''
    : `**${labels.technologies}:** ${[...new Set(technologies)].join(', ')}`;

const pageLinks = (locale: Locale, labels: TwinLabels, current: RouteId): string =>
  ROUTES.filter((route) => route.id !== current)
    .map((route) => `- [${labels.nav[route.id]}](${twinPathOf(route, locale)})`)
    .join('\n');

const projectBlock = (project: Project, locale: Locale, labels: TwinLabels): string => {
  const links = [
    project.liveUrl === undefined ? '' : `- [${labels.viewLive}](${project.liveUrl})`,
    project.githubUrl === undefined ? '' : `- [${labels.code}](${project.githubUrl})`,
  ].filter((link) => link.length > 0);

  return join([
    `### ${getLocalizedText(locale, project.titleEn, project.titleEs)}`,
    `*${labels.types[project.type]}*`,
    ...richTextToBlocks(getLocalizedText(locale, project.descriptionEn, project.descriptionEs)),
    technologiesLine(labels, project.technologies),
    links.join('\n'),
  ]);
};

const experienceBlock = (experience: Experience, locale: Locale, labels: TwinLabels): string => {
  const company = getLocalizedText(locale, experience.companyEn, experience.companyEs);
  const range = `${experience.startDate} — ${experience.endDate ?? labels.present}`;

  return join([
    `### ${getLocalizedText(locale, experience.positionEn, experience.positionEs)}`,
    company === '' ? range : `${company} · ${range}`,
    ...richTextToBlocks(getLocalizedText(locale, experience.descriptionEn, experience.descriptionEs)),
    technologiesLine(labels, experience.technologies),
  ]);
};

const skillsByCategory = (locale: Locale): string => {
  const groups = new Map<string, string[]>();
  for (const skill of getAllSkills()) {
    const items = groups.get(skill.category) ?? [];
    items.push(`- ${getLocalizedText(locale, skill.nameEn, skill.nameEs)} — ${skill.level}%`);
    groups.set(skill.category, items);
  }

  return [...groups.entries()]
    .map(([category, items]) => join([`## ${category}`, items.join('\n')]))
    .join('\n\n');
};

const buildHome = (locale: Locale, labels: TwinLabels): string => {
  const profile = getProfile();

  return finish(
    join([
      `# ${getLocalizedText(locale, profile.fullNameEn, profile.fullNameEs)}`,
      `> ${getLocalizedText(locale, profile.subtitleEn, profile.subtitleEs)}`,
      ...richTextToBlocks(getLocalizedText(locale, profile.descriptionEn, profile.descriptionEs)),
      join([
        `## ${labels.featuredProjects}`,
        getFeaturedProjects()
          .map((project) => projectBlock(project, locale, labels))
          .join('\n\n'),
      ]),
      join([`## ${labels.pages}`, pageLinks(locale, labels, 'home')]),
    ]),
  );
};

const buildAbout = (locale: Locale, labels: TwinLabels): string => {
  const profile = getProfile();
  const competencies = getAllSkills()
    .filter((skill) => skill.level >= 70)
    .map((skill) => `- ${getLocalizedText(locale, skill.nameEn, skill.nameEs)}`)
    .join('\n');
  const languages = getAllSpokenLanguages()
    .map(
      (language) =>
        `- ${getLocalizedText(locale, language.nameEn, language.nameEs)} (${getLocalizedText(locale, language.levelEn, language.levelEs)})`,
    )
    .join('\n');

  return finish(
    join([
      `# ${getLocalizedText(locale, profile.aboutTitleEn, profile.aboutTitleEs)}`,
      getLocalizedText(locale, profile.aboutIntroTitleEn, profile.aboutIntroTitleEs),
      ...richTextToBlocks(getLocalizedText(locale, profile.aboutSummaryEn, profile.aboutSummaryEs)),
      ...richTextToBlocks(
        getLocalizedText(locale, profile.aboutPhilosophyEn, profile.aboutPhilosophyEs),
      ),
      join([
        `## ${labels.aboutSentenceTitle}`,
        `> ${getLocalizedText(locale, profile.sentenceEn, profile.sentenceEs)}`,
      ]),
      join([`## ${labels.aboutCoreCompetencies}`, competencies]),
      join([`## ${labels.aboutLanguages}`, languages]),
      profile.cvUrl === '' ? '' : `[${labels.downloadCv}](${profile.cvUrl})`,
    ]),
  );
};

const buildSkills = (locale: Locale, labels: TwinLabels): string =>
  finish(join([`# ${labels.skillsHeading}`, skillsByCategory(locale)]));

const buildExperience = (locale: Locale, labels: TwinLabels): string =>
  finish(
    join([
      `# ${labels.experienceHeading}`,
      getAllExperiences()
        .map((experience) => experienceBlock(experience, locale, labels))
        .join('\n\n'),
    ]),
  );

const buildProjects = (locale: Locale, labels: TwinLabels): string =>
  finish(
    join([
      `# ${labels.projectsHeading}`,
      getAllProjects()
        .map((project) => projectBlock(project, locale, labels))
        .join('\n\n'),
    ]),
  );

const buildContact = (locale: Locale, labels: TwinLabels): string => {
  const profile = getProfile();
  const details = [
    `- **${labels.contactEmail}:** [${profile.email}](mailto:${profile.email})`,
    `- **${labels.contactLocation}:** ${getLocalizedText(locale, profile.locationEn, profile.locationEs)}`,
  ].join('\n');
  const social = [`- [GitHub](${profile.githubUrl})`, `- [LinkedIn](${profile.linkedinUrl})`].join(
    '\n',
  );

  return finish(
    join([
      `# ${labels.contactHeading}`,
      labels.contactDescription,
      details,
      `## ${labels.contactSocial}`,
      social,
      join([`## ${labels.pages}`, pageLinks(locale, labels, 'contact')]),
    ]),
  );
};

const BUILDERS: Record<RouteId, (locale: Locale, labels: TwinLabels) => string> = {
  home: buildHome,
  about: buildAbout,
  skills: buildSkills,
  experience: buildExperience,
  projects: buildProjects,
  contact: buildContact,
};

export const buildTwin = (routeId: RouteId, locale: Locale): string =>
  BUILDERS[routeId](locale, TWIN_LABELS[locale]);
