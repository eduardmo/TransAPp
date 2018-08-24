import R from 'ramda'
import React from 'react'
import MultiSelect from 'react-native-multiselect'
import Modal from 'react-native-modalbox'
import t, { form as Form } from 'tcomb-form-native'
import {
  View,
  StyleSheet,
  TouchableOpacity,
  Text
} from 'react-native'
import { Colors, Metrics } from '../../Themes/'

// extend the base Component
class MultiPicker extends Form.Component {
  constructor (props) {
    super(props)

    this.state = {
      selected: []
    }

    this.selectItems = this.selectItems.bind(this)
  }

  getLocals () {
    const locals = super.getLocals()
    return locals
  }

  selectItems ({ key }, allSelected, locals) {
    const { selected } = this.state
    let copy = selected.slice()

    if (!copy.includes(key)) {
      copy.push(key)
    } else {
      copy.splice(copy.indexOf(key), 1)
    }

    this.setState({
      selected: copy
    })

    locals.onChange(copy)
  }

  displayModal (data, selected, locals) {
    return (
      <Modal
        style={Styles.modal}
        ref={(modal) => { this.modal = modal }}
        swipeToClose
        backButtonClose
        position={'bottom'}
        backdrop
        >
        <View style={Styles.modalContent}>
          <MultiSelect
            options={data}
            onSelectionChange={(selectedRow, allSelectedRows) => this.selectItems(selectedRow, allSelectedRows, locals)}
            selectedOptions={selected}
            renderRow={(row, isSelected) =>
              <Text>{row.name} {isSelected ? 'I am selected' : 'I am not selected'}</Text>
              }
            />
        </View>
      </Modal>
    )
  }

  // this is the only required method to implement
  getTemplate () {
    const { selected } = this.state
    const { options } = this.props

    // define here your custom template
    return (locals) => {
      const data = options ? options.options.map((option) => ({
        key: option.value,
        name: option.text
      })) : []

      let textBoxStyle = [Styles.normal]
      textBoxStyle = locals.hasError ? textBoxStyle.concat(Styles.hasError) : textBoxStyle

      return (
        <View style={Styles.mainContainer}>
          <TouchableOpacity style={textBoxStyle} onPress={() => this.modal.open()}>
            <Text> Select Languages </Text>
          </TouchableOpacity>
          { data && this.displayModal(data, selected, locals) }
        </View>
      )
    }
  }
}

// as example of transformer: this is the default transformer for textboxes
MultiPicker.transformer = {
  format: value => value || null,
  parse: value => (t.String.is(value) && value.trim() === '') || value ? value : null
}

const formStyles = R.clone(Form.Form.stylesheet)
const Styles = StyleSheet.create({
  mainContainer: {
    zIndex: 9999
  },
  normal: {
    ...formStyles.textbox.normal,
    backgroundColor: Colors.snow,
    marginBottom: 15
  },
  container: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center'
  },
  hasError: {
    ...formStyles.textbox.error,
    backgroundColor: Colors.error,
    fontSize: 14,
    padding: 10,
    borderRadius: 5,
    marginBottom: 15
  },
  modal: {
    position: 'absolute',
    top: 0,
    left: 0,
    height: 9000,
    width: Metrics.width,
    backgroundColor: Colors.fire,
    zIndex: 999999
  },
  modalContent: {
    height: 800,
    backgroundColor: Colors.fire
  }
})

export default MultiPicker
