import type { ResumeData } from '../types';
import ClassicTemplate from './ClassicTemplate';
import ModernTemplate from './ModernTemplate';
import MinimalTemplate from './MinimalTemplate';

export default function TemplateRenderer({ resume }: { resume: ResumeData }) {
  if (resume.template === 'classic') return <ClassicTemplate resume={resume} />;
  if (resume.template === 'minimal') return <MinimalTemplate resume={resume} />;
  return <ModernTemplate resume={resume} />;
}
