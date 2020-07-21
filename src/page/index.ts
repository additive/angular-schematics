import {
  Rule,
  Tree,
  chain,
  externalSchematic,
  SchematicsException,
  forEach,
  SchematicContext,
} from '@angular-devkit/schematics'
import {
  Schema as AngularComponentOptions,
  Style,
} from '@schematics/angular/component/schema'
import { createDefaultPath } from '@schematics/angular/utility/workspace'
import { normalize } from '@angular-devkit/core'

export interface Options {
  name: string
  path?: string
  project: string
  feature: string
}

function renameComponentToPage(options: Options): Rule {
  return forEach((entry) => {
    let entryPath = entry.path

    const searchString = `${options.name}.component.`
    if (entry.path.includes(searchString)) {
      entryPath = normalize(entry.path.replace(searchString, `${options.name}.page.`))
    }

    return {
      path: entryPath,
      content: entry.content,
    }
  })
}

export default function (options: Options): Rule {
  return async (tree: Tree, _context: SchematicContext) => {
    if (options.feature === undefined) {
      throw new SchematicsException(`No feature name defined.`)
    }

    if (options.path === undefined) {
      options.path = await createDefaultPath(tree, options.project)
      options.path = `${options.path}/features/${options.feature}`
    }

    console.log(options)

    const angularComponentOptions: AngularComponentOptions = {
      name: options.name,
      path: `${options.path}/pages`,
      module: `${options.feature}.module`,
      project: options.project,
      style: Style.Scss,
    }

    return chain([
      externalSchematic('@schematics/angular', 'component', angularComponentOptions),
      renameComponentToPage(options),
      (tree: Tree) => {
        // const featureDir = tree.getDir(path as string)
        // const modulePath = normalize(`${path}/${module}.ts`)
        // const moduleRoutingPath = normalize(`${path}/${feature}-routing.module.ts`)
        // console.log(featureDir.subfiles)

        // const text = tree.read(moduleRoutingPath)
        // console.log(text?.toString())

        // featureDir.visit((f) => {
        //   console.log(f)
        // })

        return tree
      },
    ])
  }
}
