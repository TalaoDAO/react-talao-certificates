import React, { Component, Fragment } from 'react';
import {
  Button,
  Card,
  CardHeader,
  CardMedia,
  CardContent,
  CardActions,
  Chip,
  Grid,
  List,
  ListItem,
  ListItemText,
  Typography,
  withStyles
} from '@material-ui/core';
import { Link } from '@material-ui/icons';
import StarRatingComponent from 'react-star-rating-component';
import format from 'date-fns/format';

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
    maxWidth: '100%'
  },
  chipRoot: {
    margin: theme.spacing.unit
  }
});

class Content extends Component {

  render() {
    const { classes, json } = this.props;
    console.log(json)
    return(
      <Grid container spacing={32} alignItems="center">
        <Grid item xs={12} classes={{item: classes.gridItem}}>
        </Grid>
        <Grid item xs={12} lg={8} classes={{item: classes.gridItem}}>
          <Typography color="primary" variant="display1">
            {json.recipient.name}
          </Typography>
          <Typography color="primary" variant="headline">
            {json.badge.name}
          </Typography>
          <Typography variant="subheading" paragraph>
            {
              json.duration + ' days, from ' + format(json.start, 'D MMMM YYYY') + ' to ' + format(json.end, 'D MMMM YYYY')
            }
          </Typography>
          <Typography paragraph>
            {json.badge.description}
          </Typography>
          {
            json.skills.map(
              (skill, index) => (
                <Chip key={index} label="Basic Chip" classes={{root: classes.chipRoot}} />
              )
            )
          }
          <List>
            {
              json.ratings.map(
                (rating, index) => (
                  <ListItem key={index}>
                    <ListItemText>
                      <Typography>
                        {rating.name}
                      </Typography>
                    </ListItemText>
                    <StarRatingComponent
                      name={rating.name}
                      value={rating.ratingValue}
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
            <CardHeader
              title={'Issued by ' + json.badge.issuer.name}
              subheader={
                'On ' + format(json.issuedOn, 'D MMMM YYYY') + ' by ' + json.badge.issuer.contact.name + ', ' + json.badge.issuer.contact.jobTitle
              }/>
            <CardContent>
              <img src={json.badge.image} alt={json.badge.issuer.name} className={classes.logo} />
            </CardContent>
            <CardActions>
              <Button
                href={json.badge.issuer.url}
                target="_blank"
                rel="noopener noreferrer"
                color="primary"
                className={classes.button}>
                <Link className={classes.buttonIcon} />Website
              </Button>
            </CardActions>
          </Card>
        </Grid>
      </Grid>
    );
  }
}

export default withStyles(styles)(Content);
