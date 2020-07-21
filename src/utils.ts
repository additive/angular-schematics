import { Schema as WorkspaceSchema } from '@schematics/angular/workspace/schema'
import { Schema as ApplicationSchema } from '@schematics/angular/application/schema'
import { UnitTestTree, SchematicTestRunner } from '@angular-devkit/schematics/testing'
import * as path from 'path'

export const nodeModules = path.join(__dirname, '..', 'node_modules')
export const collectionPath = path.join(__dirname, 'collection.json')

/**
 * Setup a new angular project.
 *
 * @see https://github.com/angular/angular-cli/blob/f4f5e0bf8c471fb31a5f8207cb8f84bd5a98d7f5/packages/schematics/angular/module/index_spec.ts#L41
 */
export async function setupNewAngularProject(
  runner: SchematicTestRunner,
  appTree: UnitTestTree
): Promise<UnitTestTree> {
  appTree = await runner
    .runExternalSchematicAsync(
      '@schematics/angular',
      'workspace',
      <WorkspaceSchema>{
        name: 'workspace',
        newProjectRoot: 'projects',
        version: '10.0.0',
      },
      appTree
    )
    .toPromise()

  appTree = await runner
    .runExternalSchematicAsync(
      '@schematics/angular',
      'application',
      <ApplicationSchema>{
        name: 'bar',
        inlineStyle: false,
        inlineTemplate: false,
        routing: true,
        skipTests: false,
        skipPackageJson: false,
      },
      appTree
    )
    .toPromise()

  return appTree
}
