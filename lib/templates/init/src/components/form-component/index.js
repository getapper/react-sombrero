// LIBS
import cn from 'classnames'

// REACT
import React, {
  useMemo, memo,
} from 'react'
import {
  bool,
  func,
  node,
  number,
  oneOfType,
  shape,
  string,
} from 'prop-types'
import {
  validationStates,
} from 'root-components/use-form'
import {
  withStyles,
} from '@material-ui/core'

// STYLES
import styles from './style.js'

const InputComponent = ({
  classes,
  className,
  Component,
  error,
  field,
  helperText,
  label,
  value,
  ...props
}) => (
  <Component
    className={useMemo(() => cn(classes.container, className), [classes])}
    classes={classes}
    error={error}
    helperText={helperText}
    label={label}
    name={field}
    value={value}
    {...props}
  />
)

const InputComponentWrapper = memo(InputComponent)

InputComponent.propTypes = {
  classes: shape({}),
  className: string,
  Component: node.isRequired,
  data: shape({}).isRequired,
  error: bool,
  field: string.isRequired,
  helperText: string,
  label: string.optional,
  value: oneOfType([string, number]).isRequired,
}

InputComponent.defaultProps = {
  className: undefined,
  classes: undefined,
  error: false,
  helperText: undefined,
  label: null,
}

const FormComponent = ({
  data,
  field,
  label,
  validations,
  onChange,
  ...props
}) => {
  label = label || field.charAt(0).toUpperCase() + field.slice(1)

  return (
    <InputComponentWrapper
      error={validations[field].state === validationStates.WRONG}
      helperText={
validations[field].state === validationStates.WRONG
  ? validations[field].error
  : undefined
}
      label={label}
      name={field}
      value={data.get(field)}
      field={field}
      onChange={onChange}
      {...props}
    />
  )
}

FormComponent.propTypes = {
  data: shape({}).isRequired,
  field: string.isRequired,
  label: string.optional,
  onChange: func.isRequired,
  validations: shape({}).isRequired,
}

FormComponent.defaultProps = {
  label: null,
}

export default withStyles(styles)(memo(FormComponent))
