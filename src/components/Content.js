import React from 'react'
import {
  Button,
  Card, CardHeader, CardContent, CardActions,
  Chip,
  Grid,
  Typography,
  withStyles
} from '@material-ui/core'
import { Link } from '@material-ui/icons'
import StarRatingComponent from 'react-star-rating-component'
import format from 'date-fns/format'

const styles = theme => ({
  gridContainerRoot: {
    marginBottom: theme.spacing.unit * 2
  },
  gridItem: {
    textAlign: 'center'
  },
  listRoot: {
    textAlign: 'center'
  },
  listItemRoot: {
    marginTop: theme.spacing.unit,
    [theme.breakpoints.down('xs')]: {
      display: 'block'
    }
  },
  gridContainerRatings: {
    marginTop: theme.spacing.unit * 4,
    textAlign: 'left'
  },
  button: {
    marginLeft: 'auto'
  },
  buttonIcon: {
    marginRight: theme.spacing.unit
  },
  cardRootIssuer: {
    boxShadow: 'none',
    borderLeft: '2px solid #edecec',
    borderRadius: 0,
    [theme.breakpoints.down('sm')]: {
      borderLeft: 'none'
    }
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
  },
  description: {
    margin: theme.spacing.unit * 3
  },
  ratings: {
    width: '75%',
    marginLeft: 'auto',
    marginRight: 'auto',
    marginTop: theme.spacing.unit * 4,
    display: 'flex',
    flexDirection: 'column',
    alignContent: 'center',
    textAlign: 'left',
    [theme.breakpoints.down('sm')]: {
      width: '100%',
      marginLeft: 0,
      marginRight: 0,
      textAlign: 'center'
    }
  },
  rating: {
    display: 'flex',
    flexDirection: 'row',
    alignContent: 'space-around',
    marginBottom: theme.spacing.unit * 2,
    [theme.breakpoints.down('sm')]: {
      flexDirection: 'column'
    }
  },
  ratingTitle: {
    flex: 3
  },
  ratingStars: {
    flex: 1
  }
})

class Content extends React.Component {

  render() {
    const { classes, json } = this.props
    const { recipient, issuer, certificate } = json
    const { organization, partner, responsible } = issuer
    return (
      <Grid container spacing={32} alignItems="center" classes={{ container: classes.gridContainerRoot }}>
        <Grid item xs={12} lg={8} classes={{ item: classes.gridItem }}>
          <Typography color="primary" variant="h1" classes={{ root: classes.certificateTitle }}>
            {certificate.title}
          </Typography>
          <Typography variant="h4" paragraph>
            {
              certificate.duration + ' days, from ' + format(certificate.from, 'D MMMM YYYY') + ' to ' + format(certificate.to, 'D MMMM YYYY')
            }
          </Typography>
          <Typography paragraph className={classes.description}>
            {certificate.description}
          </Typography>
          {
            certificate.skills.map(
              (skill, index) => (
                <Chip
                  key={index}
                  label={skill.name}
                  classes={{ root: classes.chipRoot }} />
              )
            )
          }
          <Grid item xs={12}>
            <div className={classes.ratings}>
              {
                certificate.ratings.map(
                  (rating, index) => (
                    <div key={index} className={classes.rating}>
                      <div className={classes.ratingTitle}>
                        <Typography>
                          {rating.title}
                        </Typography>
                      </div>
                      <div className={classes.ratingStars}>
                        <StarRatingComponent
                          name={rating.title}
                          value={rating.score}
                          editing={false}
                          starCount={5}
                        />
                      </div>
                    </div>
                  )
                )
              }
            </div>
          </Grid>
        </Grid>
        <Grid item xs={12} lg={4} classes={{ item: classes.gridItem }}>
          <Card classes={{ root: classes.cardRootIssuer }}>
            <CardHeader
              title={
                <Typography variant="h2">
                  {'Issued by ' + organization.name + ' for ' + recipient.name}
                </Typography>
              } />
            <CardContent>
              <Grid container>
                <Grid item xs={3}></Grid>
                <Grid item xs={6}>
                  <img src={organization.image} alt={organization.name} className={classes.logo} />
                </Grid>
                <Grid item xs={3}></Grid>
                <Grid item xs={12}>
                  {
                    partner.text !== '' && (
                      <Typography paragraph>
                        <em>{partner.text}</em>
                      </Typography>
                    )
                  }
                  <Typography paragraph>
                    {
                      'By ' + responsible.name + ', ' + responsible.title
                    }
                  </Typography>
                  <img src={responsible.image} alt={responsible.name} className={classes.signature} />
                </Grid>
              </Grid>
            </CardContent>
            <CardActions>
              <Button
                href={organization.url}
                target="_blank"
                rel="noopener noreferrer"
                variant="outlined"
                color="primary"
                className={classes.button}>
                <Link className={classes.buttonIcon} />Website
              </Button>
            </CardActions>
          </Card>
        </Grid>
      </Grid >
    )
  }
}

export default withStyles(styles)(Content)
