import { SchematicTestRunner, UnitTestTree } from '@angular-devkit/schematics/testing'

import { Options } from './index'
import { Options as FeatureOptions } from '../feature/index'
import { collectionPath, setupNewAngularProject } from '../utils'

fdescribe('page', () => {
  const runner = new SchematicTestRunner('schematics', collectionPath)

  const defaultOptions: Options = {
    name: 'baz',
    feature: 'foo',
    project: 'bar',
  }

  let appTree: UnitTestTree

  beforeEach(async () => {
    appTree = await setupNewAngularProject(runner, appTree)
    appTree = await runner
      .runSchematicAsync(
        'feature',
        <FeatureOptions>{
          name: 'foo',
          project: 'bar',
        },
        appTree
      )
      .toPromise()
  })

  it('should create a new page for feature foo', async () => {
    const options = { ...defaultOptions }

    const tree = await runner.runSchematicAsync('page', options, appTree).toPromise()
    const files = tree.files

    console.log(files)

    expect(files).toContain('/projects/bar/src/app/features/foo/pages/baz/baz.page.scss')
    expect(files).toContain('/projects/bar/src/app/features/foo/pages/baz/baz.page.html')
    expect(files).toContain(
      '/projects/bar/src/app/features/foo/pages/baz/baz.page.spec.ts'
    )
    expect(files).toContain('/projects/bar/src/app/features/foo/pages/baz/baz.page.ts')
  })

  it('should create add a new page to feature module', async () => {
    const options = { ...defaultOptions }

    const tree = await runner.runSchematicAsync('page', options, appTree).toPromise()
    const files = tree.files

    console.log(files)

    expect(tree.get('/projects/bar/src/app/features/foo/foo.module.ts')).toContain(
      "import { BazComponent } from './pages/baz/baz.page'"
    )
  })
})
