import { NestFastifyApplication } from '@nestjs/platform-fastify';
import { writeFile } from 'fs/promises';
import { SpelunkerModule } from 'nestjs-spelunker';
import { resolve } from 'path';

export async function generateMermaidGraph(app: NestFastifyApplication) {
  const tree = SpelunkerModule.explore(app);
  const root = SpelunkerModule.graph(tree);
  const edges = SpelunkerModule.findGraphEdges(root);

  let res = 'graph LR\n';

  const mermaidEdges = edges.map(
    ({ from, to }) => `  ${from.module.name}-->${to.module.name}`,
  );

  res += mermaidEdges.join('\n');

  await writeFile(resolve(__dirname, '../mermaidGraph.txt'), res, {
    encoding: 'utf-8',
    flag: 'w',
  });
}
