import type {
  FeatureProvider,
  FloatingToolbarSection,
  FloatingToolbarSectionEntry,
} from '../../../../packages/richtext-lexical/src'

import { ModalMode, TOGGLE_FOOTNOTE_MODAL_COMMAND } from './plugins'

export const SectionWithEntries = (
  entries: FloatingToolbarSectionEntry[],
): FloatingToolbarSection => {
  return {
    entries,
    key: 'footnote',
    order: 1,
    type: 'buttons',
  }
}
export const FootnoteFeature = (props: any): FeatureProvider => {
  return {
    feature: () => {
      return {
        floatingSelectToolbar: {
          sections: [
            SectionWithEntries([
              {
                ChildComponent: () =>
                  // @ts-expect-error
                  import('./icon').then((module) => module.FootnoteIcon),
                isActive: () => false,
                isEnabled: ({ selection }) => {
                  if (!selection || !selection?.getNodes()?.length) {
                    return false
                  }
                },
                key: 'footnote',
                label: `Insert Footnote`,
                onClick: ({ editor }) => {
                  editor.dispatchCommand(TOGGLE_FOOTNOTE_MODAL_COMMAND, {
                    open: true,
                    mode: ModalMode.INSERT,
                  })
                },
              },
            ]),
          ],
        },
        plugins: [
          {
            Component: () =>
              // @ts-expect-error
              import('./plugins').then((module) => module.FootnotePlugin),
            position: 'normal',
          },
        ],
        props,
      }
    },
    key: 'footnote',
  }
}
