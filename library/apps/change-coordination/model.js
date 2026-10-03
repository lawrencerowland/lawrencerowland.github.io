(function(root){
 'use strict';
 const rules={linear:n=>n/10,pairs:n=>(n+n*(n-1)/2)/10,cubic:n=>n*n*n/10};
 function integer(n,min,max){if(!Number.isInteger(n)||n<min||n>max)throw new Error('Count outside the model range.');}
 function calculate(n,rule,groups,overhead){
  integer(n,1,5);integer(groups,1,n);if(!Object.hasOwn(rules,rule))throw new Error('Unknown cost rule.');
  if(typeof overhead!=='number'||!Number.isFinite(overhead)||overhead<0||overhead>1)throw new Error('Interface cost must be between 0 and 1.');
  const cost=rules[rule],sizes=Array.from({length:groups},(_,i)=>Math.floor(n/groups)+(i<n%groups?1:0));
  const cross=(n*n-sizes.reduce((s,k)=>s+k*k,0))/2,internal=sizes.reduce((s,k)=>s+cost(k),0),boundary=cross*overhead;
  return {n,rule,groups,overhead,sizes,cross,internal,boundary,split:internal+boundary,total:cost(n),deltas:Array.from({length:n},(_,i)=>cost(i+1)-cost(i))};
 }
 const api={calculate,rules};if(typeof module!=='undefined')module.exports=api;root.Coordination=api;
})(typeof globalThis!=='undefined'?globalThis:this);
