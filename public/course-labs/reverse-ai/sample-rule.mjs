export function scoreTicket(ticket){
 const score=ticket.severity*2+ticket.impact+(ticket.blocked?5:0);
 return {score,priority:score>=22?'critical':score>=14?'high':'normal'};
}
