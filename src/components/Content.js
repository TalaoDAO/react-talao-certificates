import React from 'react'
import {
  Button,
  Card, CardHeader, CardContent, CardActions,
  Chip,
  Grid,
  List, ListItem, ListItemText,
  Typography,
  withStyles
} from '@material-ui/core'
import { Link } from '@material-ui/icons'
import StarRatingComponent from 'react-star-rating-component'
import format from 'date-fns/format'

const styles = theme => ({
  gridItem: {
    textAlign: 'center'
  },
  button: {
    marginLeft: 'auto'
  },
  buttonIcon: {
    marginRight: theme.spacing.unit
  },
  logo: {
    maxWidth: '100%',
    marginBottom: theme.spacing.unit
  },
  signature: {
    maxWidth: '30%',
  },
  chipRoot: {
    margin: theme.spacing.unit
  }
})

class Content extends React.Component {

  render() {
    const { classes, json } = this.props
    const { recipient, issuer, certificate } = json
    const { organization, responsible } = issuer
    return(
      <Grid container spacing={32} alignItems="center">
        <Grid item xs={12} classes={{item: classes.gridItem}}>
        </Grid>
        <Grid item xs={12} lg={8} classes={{item: classes.gridItem}}>
          <Typography color="primary" variant="display1" paragraph>
            {certificate.title}
          </Typography>
          <Typography variant="subheading" paragraph>
            {
              certificate.duration + ' days, from ' + format(certificate.start, 'D MMMM YYYY') + ' to ' + format(certificate.end, 'D MMMM YYYY')
            }
          </Typography>
          <Typography paragraph>
            {certificate.description}
          </Typography>
          {
            certificate.skills.map(
              (skill, index) => (
                <Chip
                  key={index}
                  label={skill.name}
                  classes={{root: classes.chipRoot}} />
              )
            )
          }
          <List>
            {
              certificate.ratings.map(
                (rating, index) => (
                  <ListItem key={index}>
                    <ListItemText>
                      <Typography>
                        {rating.title}
                      </Typography>
                    </ListItemText>
                    <StarRatingComponent
                      name={rating.title}
                      value={rating.score}
                      editing={false}
                      starCount={5}
                    />
                  </ListItem>
                )
              )
            }
          </List>
        </Grid>
        <Grid item xs={12} lg={4} classes={{item: classes.gridItem}}>
          <Card>
            <CardHeader title={'Issued to ' + recipient.name + ' by ' + organization.name} />
            <CardContent>
              <img src={organization.image} alt={organization.name} className={classes.logo} />
              <Typography>
                {
                  'On ' + format(certificate.issuedOn, 'D MMMM YYYY') + ' by ' + responsible.name + ', ' + responsible.title
                }
              </Typography>
              <img src={responsible.image} alt={responsible.name} className={classes.signature} />
            </CardContent>
            <CardActions>
              <Button
                href={organization.url}
                target="_blank"
                rel="noopener noreferrer"
                variant="contained"
                color="primary"
                className={classes.button}>
                <Link className={classes.buttonIcon} />Website
              </Button>
            </CardActions>
          </Card>
        </Grid>
      </Grid>
    )
  }
}

export default withStyles(styles)(Content)
