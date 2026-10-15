import {scoreTicket} from './sample-rule.mjs';
export function renderTicket(ticket){const summary=scoreTicket(ticket);return {label:summary.priority,score:summary.score};}
