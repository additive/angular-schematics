import { SchematicTestRunner, UnitTestTree } from '@angular-devkit/schematics/testing'

import { Options } from './index'
import { collectionPath, setupNewAngularProject } from '../utils'

describe('feature', () => {
  const runner = new SchematicTestRunner('schematics', collectionPath)

  const defaultOptions: Options = {
    name: 'foo',
    project: 'bar',
  }

  let appTree: UnitTestTree

  beforeEach(async () => {
    appTree = await setupNewAngularProject(runner, appTree)
  })

  it('should create a module, routing-module and module component', async () => {
    const options = { ...defaultOptions }

    const tree = await runner.runSchematicAsync('feature', options, appTree).toPromise()
    const files = tree.files

    expect(files).toContain('/projects/bar/src/app/features/foo/foo-routing.module.ts')
    expect(files).toContain('/projects/bar/src/app/features/foo/foo.module.ts')
    expect(files).toContain('/projects/bar/src/app/features/foo/foo.component.scss')
    expect(files).toContain('/projects/bar/src/app/features/foo/foo.component.html')
    expect(files).toContain('/projects/bar/src/app/features/foo/foo.component.spec.ts')
    expect(files).toContain('/projects/bar/src/app/features/foo/foo.component.ts')
  })
})
