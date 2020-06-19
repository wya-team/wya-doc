const testsContext = require.context('../src/', true, /\.test$/);
testsContext.keys().forEach(testsContext);
