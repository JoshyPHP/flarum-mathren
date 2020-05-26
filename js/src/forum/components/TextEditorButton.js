import app from 'flarum/app';
import Component from 'flarum/Component';
import Dropdown from 'flarum/components/Dropdown';
import Button from 'flarum/components/Button';
import ItemList from 'flarum/utils/ItemList';
import icon from 'flarum/helpers/icon';

const localePrefix = 'the-turk-mathren.forum.textEditor.';

export default class extends Component {
  init() {
    this.textEditor = this.props.textEditor;

    this.delimiters = {
      inline: app.forum.attribute('mathRenMainInlineDelimiter'),
      block: app.forum.attribute('mathRenMainBlockDelimiter')
    };
  }

  view() {
    return Dropdown.component({
      className: 'MathRenDropdown',
      buttonClassName: 'Button Button--flat',
      label: icon('fas fa-square-root-alt'),
      children: this.items().toArray()
    });
  }

  /**
   * Build an item list for the contents of the dropdown menu.
   *
   * @return {ItemList}
   */
  items() {
    const items = new ItemList();

    items.add('mathBlock', Button.component({
        icon: 'fas fa-vector-square',
        children: app.translator.trans(localePrefix + 'blockExpression'),
        onclick: () => {
          // opening tag (left delimiter)
          const leftDelim = this.delimiters.block['left'];
          // closing tag (right delimiter)
          const rightDelim = this.delimiters.block['right'];

          var wrapper = this.wrapSelection(leftDelim, rightDelim);

          this.textEditor.setValue(wrapper.value);
          this.textEditor.setSelectionRange(wrapper.range);
        },
      }),
      50
    );

    items.add('mathInline', Button.component({
        icon: 'fas fa-grip-lines',
        children: app.translator.trans(localePrefix + 'inlineExpression'),
        onclick: () => {
          // opening tag (left delimiter)
          const leftDelim = this.delimiters.inline['left'];
          // closing tag (right delimiter)
          const rightDelim = this.delimiters.inline['right'];

          var wrapper = this.wrapSelection(leftDelim, rightDelim);

          this.textEditor.setValue(wrapper.value);
          this.textEditor.setSelectionRange(wrapper.range);
        },
      }),
      0
    );

    return items;
  }

  /**
   * Wrap the current selection with BBCode tags
   * If there's no selection, put them around the cursor
   * Adapted from the flagrow/fonts extension (under The MIT License)
   *
   * @param string leftDelim
   * @param string rightDelim
   * @returns {object}
   */
  wrapSelection(leftDelim, rightDelim) {
    const range = this.textEditor.getSelectionRange();
    const value = this.textEditor.value();

    const before = value.slice(0, range[0]);
    const after = value.slice(range[1]);
    const selected = value.slice(range[0], range[1]);

    return {
      value: before + leftDelim + selected + rightDelim + after,
      range: before.length + leftDelim.length + before.length + rightDelim.length + selected.length
    }
  }
}
