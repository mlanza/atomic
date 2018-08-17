export function Task(fork){
  this.fork = fork;
}

export function task(fork){
  return new Task(fork);
}

function resolve(value){
  return task(function(reject, resolve){
    resolve(value);
  });
}

function reject(value){
  return task(function(reject, resolve){
    reject(value);
  });
}

export default Task;

Task.of = resolve;
Task.resolve = resolve;
Task.reject = reject;