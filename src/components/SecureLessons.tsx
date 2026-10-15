import { CurriculumBrowser } from './curriculum/CurriculumBrowser';
import { LessonViewerV2 } from './lesson-v2/LessonViewerV2';

export function LessonList(props:{initialTrack?:string;initialMode?:'main'|'parallel';initialModule?:string}) {
  return <CurriculumBrowser {...props} />;
}
export function LessonViewer({id,onRefresh}:{id:number;onRefresh:()=>void}) {
  return <LessonViewerV2 id={id} onRefresh={onRefresh}/>;
}
