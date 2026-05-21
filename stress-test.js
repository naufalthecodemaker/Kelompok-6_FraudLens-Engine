import http from 'k6/http';
import { sleep, check } from 'k6';

export const options = {
  stages: [
    { duration: '3s', target: 15 }, 
    { duration: '7s', target: 35 },  
    { duration: '3s', target: 0 },   
  ],
};

export default function () {
  const dbType = __ENV.DB_TYPE || 'neo4j'; 
  
  const res = http.get(`http://localhost:3000/api/benchmark?db=${dbType}`);
  
  check(res, {
    'status is 200': (r) => r.status === 200,
  });
  
  sleep(0.1);
}