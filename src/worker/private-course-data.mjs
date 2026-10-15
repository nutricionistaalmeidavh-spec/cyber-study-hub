// Server-only imports. Never import this module in src/App.tsx or React pages.
import { lessons } from '../data/lessons.ts';
import { lessonDetails } from '../data/lessonDetails.ts';
import { scenarios, reviewPacks } from '../data/games.ts';
import ai from '../trails/ai-dev/modules.json' with { type: 'json' };
import aiLabs from '../trails/ai-dev/labContracts.json' with { type: 'json' };
import dark from '../trails/channel-dark/modules.json' with { type: 'json' };
import darkWorkshops from '../trails/channel-dark/oficinas.json' with { type: 'json' };
import lesson47 from '../content/main/047/lesson.json' with { type: 'json' };
import lesson48 from '../content/main/048/lesson.json' with { type: 'json' };
import lesson49 from '../content/main/049/lesson.json' with { type: 'json' };
import lesson50 from '../content/main/050/lesson.json' with { type: 'json' };
import lesson51 from '../content/main/051/lesson.json' with { type: 'json' };
import lesson52 from '../content/main/052/lesson.json' with { type: 'json' };
import lesson53 from '../content/main/053/lesson.json' with { type: 'json' };
import lesson54 from '../content/main/054/lesson.json' with { type: 'json' };
import lesson55 from '../content/main/055/lesson.json' with { type: 'json' };
import lesson56 from '../content/main/056/lesson.json' with { type: 'json' };
import lesson57 from '../content/main/057/lesson.json' with { type: 'json' };
import lesson58 from '../content/main/058/lesson.json' with { type: 'json' };
import lesson59 from '../content/main/059/lesson.json' with { type: 'json' };
import lesson60 from '../content/main/060/lesson.json' with { type: 'json' };
const native = new Map([47,lesson47],[48,lesson48],[49,lesson49],[50,lesson50],[51,lesson51],[52,lesson52],[53,lesson53],[54,lesson54],[55,lesson55],[56,lesson56],[57,lesson57],[58,lesson58],[59,lesson59],[60,lesson60].map(([id,item])=>[id,item]));
export const privateCourseSource = {
  getLesson(id) {
    const nativeLesson = native.get(id);
    if(nativeLesson)return {kind:'native',lesson:nativeLesson};
    const lesson=lessons.find(l=>l.id===id);
    return lesson?{kind:'legacy',lesson,detail:lessonDetails[id]??null}:null;
  },
  getTrail(id){
    if(id==='ai-dev')return {modules:ai.modules,labContracts:aiLabs};
    if(id==='channel-dark')return {modules:dark.modules,oficinas:darkWorkshops};
    return null;
  },
  getGames(){return {reviewPacks,scenarios};}
};
