"""Telemetria fictícia. Nunca envia comandos para hardware ou redes industriais."""
from statistics import median

def evaluate(rows,limit=100,consecutive=2):
    streak=0
    for row in rows:
        displayed=row.get('hmi');sensors=row.get('sensors',[])
        if displayed is None or len(sensors)<2 or any(x is None for x in sensors):
            return 'INSUFFICIENT'
        divergent=abs(median(sensors)-displayed)>limit
        streak=streak+1 if divergent else 0
        if streak>=consecutive:return 'INVESTIGATE'
    return 'OK'
if __name__=='__main__':
    print({'normal':evaluate([{'hmi':1000,'sensors':[1000,1001]},{'hmi':1000,'sensors':[999,1000]}]),
           'divergent':evaluate([{'hmi':1000,'sensors':[1249,1250]},{'hmi':1000,'sensors':[1248,1251]}]),
           'missing':evaluate([{'hmi':None,'sensors':[999,1000]}])})
