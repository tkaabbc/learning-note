// https://codesandbox.io/s/usedebounce-forked-culz3?file=/src/App.js
// usePrevious获取更新前的值
function usePrevious(value) {
  const ref = useRef();
  useEffect(() => {
    ref.current = value;
  });
  return ref.current;
}
// usage
function Counter() {
  const [count, setCount] = useState(0);
  const prevCount = usePrevious(count);
  return <h1>Now: {count}, before: {prevCount}</h1>;
}

/**
 * 模拟componentDidMount
 * useDidMount hook
 * Calls a function on mount
 *
 * @param {Function} callback Callback function to be called on mount
 */
 function useDidMount(callback) {
  useEffect(() => {
    if (typeof callback === 'function') {
      callback();
    }
  }, []);
}

/**
 * 模拟componentDidUpdate
 * 第一次（mount）不触发，第二次（update）更新数据才触发
 * @param {*} callback 
 * @param {*} conditions 
 */
function useDidUpdate(callback, conditions) {
  const hasMountedRef = useRef(false);
  
  useEffect(() => {
    if (hasMountedRef.current) {
      callback();
    } else {
      hasMountedRef.current = true;
    }
  }, conditions);
}