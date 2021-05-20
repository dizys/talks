import {sync as glob} from 'glob';
import * as Path from 'path';

import {$} from './@utils';
import {DIST_DIR} from './@paths';

async function main() {
  let paths = glob('slides/**/*.md');

  for (let path of paths) {
    await buildSlide(path);
  }
}

main().catch(error => {
  console.error(error);
  process.exit(1);
});

async function buildSlide(pathStr: string) {
  let path = Path.parse(pathStr);
  let subDir = path.dir.slice(7);
  let webPath = `${subDir}/${path.name}/`;
  let outDir = Path.join(DIST_DIR, subDir, path.name);
  await $`yarn slidev build ${pathStr} --base /talks/${webPath} --out ${outDir}`;
}
