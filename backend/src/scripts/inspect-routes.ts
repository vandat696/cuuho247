import app from '../app';

function print(path: string[], layer: any) {
  if (layer.route) {
    layer.route.stack.forEach((stackItem: any) => {
      console.log(`${stackItem.method.toUpperCase()} /api${path.join('')}${layer.route.path}`);
    });
  } else if (layer.name === 'router' && layer.handle.stack) {
    const routePath = layer.regexp
      .toString()
      .replace('/^\\/', '')
      .replace('\\/?(?=\\/|$)/i', '')
      .replace('\\/?$/i', '')
      .replace(/\\\//g, '/');

    // Clean regex match to readable path
    let segment = routePath;
    if (segment.startsWith('admin')) segment = '/admin';
    else if (segment.startsWith('auth')) segment = '/auth';
    else if (segment.startsWith('users')) segment = '/users';
    else if (segment.startsWith('companies')) segment = '/companies';
    else if (segment.startsWith('company')) segment = '/company';

    layer.handle.stack.forEach((subLayer: any) => {
      print(path.concat(segment), subLayer);
    });
  }
}

console.log('--- Express Routes ---');
app._router.stack.forEach((layer: any) => {
  print([], layer);
});
console.log('----------------------');
