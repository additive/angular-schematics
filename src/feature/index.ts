import {
  Rule,
  Tree,
  chain,
  apply,
  SchematicContext,
  url,
  mergeWith,
  applyTemplates,
  move,
  externalSchematic,
} from '@angular-devkit/schematics'
import { createDefaultPath } from '@schematics/angular/utility/workspace'
import { strings } from '@angular-devkit/core'
import {
  Style,
  Schema as AngularComponentOptions,
} from '@schematics/angular/component/schema'

export interface Options {
  name: string
  path?: string
  project: string
}

function writeTemplateFiles(options: Options): Rule {
  return (tree: Tree, _context: SchematicContext) => {
    const parameterizedTemplates = apply(url('./files'), [
      applyTemplates({
        ...strings,
        ...options,
      }),
      // @ts-ignore path is not undefined at this point
      move(options.path),
    ])

    return mergeWith(parameterizedTemplates)(tree, _context)
  }
}

export default function (options: Options): Rule {
  return async (tree: Tree, _context: SchematicContext) => {
    if (options.path === undefined) {
      options.path = await createDefaultPath(tree, options.project)
      options.path = `${options.path}/features`
    }

    // TODO: add option to make component/module standalone without `routing.module`

    const angularComponentOptions: AngularComponentOptions = {
      name: options.name,
      path: options.path,
      module: `${options.name}.module`,
      project: options.project,
      style: Style.Scss,
    }

    return chain([
      writeTemplateFiles(options),
      externalSchematic('@schematics/angular', 'component', angularComponentOptions),
    ])
  }
}
