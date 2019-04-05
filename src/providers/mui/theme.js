import { createMuiTheme } from '@material-ui/core/styles'

import colors from './colors'

const theme = createMuiTheme({
  palette: {
    primary: {
      main: colors.primary
    },
    secondary: {
      main: colors.secondary,
    },
    background: {
      default: colors.greyLight,
    }
  },
  typography: {
    useNextVariants: true,
    fontSize: 13
  },
  overrides: {
    MuiCard: {
      root: {
        borderRadius: '5px'
      }
    },
    MuiButton: {
      text: {
        color: 'blue !important'
      }
    }
  }
})

Object.entries(theme.typography).forEach(entry => {
  const variantName = entry[0]
  const variant = entry[1]
  if (typeof variant !== 'object') {
    return
  }
  theme.typography[variantName] = {
    ...variant,
    [theme.breakpoints.down('sm')]: {
      fontSize: (parseFloat(variant.fontSize) * 0.7) + 'rem'
    },
    // [theme.breakpoints.down('lg')]: {
    //   fontSize: (parseFloat(variant.fontSize) * 0.8) + 'rem'
    // }
  }
})

theme.overrides.MuiAvatar = {
  root: {
    fontSize: '1rem',
    width: theme.spacing.unit * 6,
    height: theme.spacing.unit * 6,
    minHeight: theme.spacing.unit * 6,
    [theme.breakpoints.down('sm')]: {
      width: theme.spacing.unit * 5,
      height: theme.spacing.unit * 5,
      minHeight: theme.spacing.unit * 5,
    }
  }
}

theme.overrides.MuiButton = {
  root: {
    fontSize: '0.625rem',
    letterSpacing: 'unset'
  },
  sizeSmall: {
    letterSpacing: 'unset'
  },
  text: {
    [theme.breakpoints.down('sm')]: {
      fontSize: '10px !important'
    }
  },
}

theme.overrides.MuiCardActions = {
  root: {
    padding: theme.spacing.unit / 2,
    [theme.breakpoints.down('sm')]: {
      fontSize: '10px !important'
    }
  }
}

theme.overrides.MuiCardContent = {
  root: {
    paddingTop: theme.spacing.unit,
    paddingBottom: theme.spacing.unit,
    paddingLeft: theme.spacing.unit * 2,
    paddingRight: theme.spacing.unit * 2,
    '&:last-child': {
      paddingBottom: theme.spacing.unit
    }
  }
}

theme.overrides.MuiCardHeader = {
  root: {
    // padding: theme.spacing.unit,
    [theme.breakpoints.down('sm')]: {
      padding: theme.spacing.unit
    }
  },
  title: {
    fontSize: '0.9375rem',
    fontWeight: 500,
    letterSpacing: 'unset'
  },
  subheader: {
    fontSize: '0.75rem'
  }
}

theme.overrides.MuiChip = {
  root: {
    marginTop: theme.spacing.unit,
    marginRight: theme.spacing.unit,
    marginBottom: 0,
    marginLeft: 0,
    fontSize: '0.75rem',
    [theme.breakpoints.down('sm')]: {
      fontSize: '10px !important'
    }
  }
}

theme.overrides.MuiDialog = {
  paperScrollBody: {
    [theme.breakpoints.down('sm')]: {
      margin: theme.spacing.unit + 'px !important'
    }
  }
}

theme.overrides.MuiFab = {
  root: {
    width: theme.spacing.unit * 6,
    height: theme.spacing.unit * 6,
    minHeight: theme.spacing.unit * 6,
    boxShadow: '0px 2px 3px -1px rgba(0,0,0,0.2), 0px 3px 3px 0px rgba(0,0,0,0.14), 0px 1px 12px 0px rgba(0,0,0,0.12)'
  }
}

theme.overrides.MuiInput = {
  input: {
    fontSize: '0.8125rem'
  }
}

theme.overrides.MuiInputLabel = {
  root: {
    fontSize: '0.8125rem'
  }
}

theme.overrides.MuiListItem = {
  // button: {
  //   '&:focus': {
  //     backgroundColor: 'unset'
  //   }
  // }
}

theme.overrides.MuiListItemIcon = {
  root: {
    color: theme.palette.text.default
  }
}

theme.overrides.MuiListItemText = {
  primary: {
    fontSize: '0.8125rem',
  }
}

theme.overrides.MuiMenuItem = {
  root: {
    fontSize: '0.8125rem',
  }
}

theme.overrides.MuiSvgIcon = {
  root: {
    fontSize: '1.25rem'
  },
}

theme.overrides.MuiTypography = {
  h1: {
    fontSize: '1.125rem',
    fontWeight: 500,
    letterSpacing: 'unset',
    marginBottom: theme.spacing.unit * 2,
    [theme.breakpoints.down('sm')]: {
      fontSize: '1.125rem',
    }
  },
  h2: {
    fontSize: '0.9375rem',
    fontWeight: 500,
    letterSpacing: 'unset',
    marginBottom: theme.spacing.unit,
    [theme.breakpoints.down('sm')]: {
      fontSize: '0.9375rem'
    }
  },
  h3: {
    fontSize: '0.9375rem',
    fontWeight: 400,
    letterSpacing: 'unset',
    lineHeight: 1.15,
    marginBottom: theme.spacing.unit,
    [theme.breakpoints.down('sm')]: {
      fontSize: '0.9375rem'
    }
  },
  h4: {
    fontSize: '0.8125rem',
    letterSpacing: 'unset',
    color: theme.palette.grey[600],
    marginBottom: theme.spacing.unit,
    [theme.breakpoints.down('sm')]: {
      fontSize: '0.8125rem'
    }
  },
  body2: {
    [theme.breakpoints.down('sm')]: {
      fontSize: '0.6875rem'
    }
  }
}

export default theme