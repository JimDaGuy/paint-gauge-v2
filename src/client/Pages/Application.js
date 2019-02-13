import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import IconButton from '@material-ui/core/IconButton';
import BookmarkIcon from '@material-ui/icons/Bookmark';
import BookmarkBorderIcon from '@material-ui/icons/BookmarkBorder';
import OpenInNewIcon from '@material-ui/icons/OpenInNew';

import $ from 'jquery';
import MainAppBar from '../Components/MainAppBar';
import ImageContainer from '../Components/ImageContainer';
import RatingBar from '../Components/RatingBar';
// import style from './Application.module.scss';

const styles = theme => ({
  grow: {
    flexGrow: 1
  },
  container: {
    backgroundColor: theme.palette.common.white,
    minWidth: '300px'
  },
  paintingTitle: {
    lineHeight: '1.25rem',
    maxHeight: '3.75rem',
    padding: '10px 0 0 10px',
    textOverflow: 'ellipsis',
    wordWrap: 'break-word',
    overflow: 'hidden',
    display: '-webkit-box',
    '-webkit-line-clamp': '3',
    '-webkit-box-orient': 'vertical',
    fontWeight: 'bold'
  },
  options: {
    display: 'flex',
    justifyContent: 'center',
    alignContent: 'center',
    justifyItems: 'center',
    alignItems: 'center'
  },
  iconButton: {
    margin: theme.spacing.unit,
    color: theme.palette.primary.main,
    '&:hover': {
      color: theme.palette.primary.light
    },
    '&:active': {
      color: theme.palette.primary.dark
    }
  },
  [theme.breakpoints.up('md')]: {
    container: {}
  },
  [theme.breakpoints.up('lg')]: {
    container: {}
  }
});

class Application extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      bookmarked: false,
      currentRating: 3,
      id: null,
      imageURL: null,
      title: null,
      loading: true
    };

    this.setLoading = this.setLoading.bind(this);
    this.getPainting = this.getPainting.bind(this);
    this.sendRating = this.sendRating.bind(this);
    this.bookmarkImage = this.bookmarkImage.bind(this);
    this.updateRatingState = this.updateRatingState.bind(this);
  }

  componentDidMount() {
    fetch('/api/checkLogin')
      .then(res => res.json())
      .then((response) => {
        if (response.loggedIn) {
          this.getPainting();
        }
      });
  }

  setLoading(loading) {
    this.setState({
      loading
    });
  }

  getPainting() {
    this.setLoading(true);
    fetch('/api/getRandomPainting')
      .then(res => res.json())
      .then((response) => {
        console.dir(response);
        // Return bookmarked also and set it here
        this.setState({
          id: response.id,
          imageURL: response.primaryimageurl,
          title: response.title,
          url: response.url
        });
      });
  }

  sendRating() {
    const { currentRating, id } = this.state;
    const { csrf } = this.props;

    $.ajax({
      cache: false,
      type: 'POST',
      url: '/api/sendRating',
      data: {
        rating: currentRating,
        imageID: id,
        _csrf: csrf
      },
      dataType: 'json',
      success: () => {
        this.getPainting();
      },
      error: (error) => {
        if (error) {
          const errorMessage = error.responseJSON.error;
          console.dir(errorMessage);
        }
      }
    });
    return false;
  }

  bookmarkImage() {
    const { bookmarked } = this.state;
    this.setState({
      bookmarked: !bookmarked
    });
    console.dir(bookmarked);
  }

  updateRatingState(rating) {
    this.setState({
      currentRating: rating
    });
  }

  render() {
    const { classes, updateLogin, csrf } = this.props;
    const {
      id, imageURL, title, loading, url, bookmarked
    } = this.state;

    return (
      <div className={`${classes.grow} ${classes.container}`}>
        <MainAppBar updateLogin={updateLogin} />
        <ImageContainer
          imageAlt={title}
          imageURL={imageURL}
          setLoading={this.setLoading}
          loading={loading}
        />
        <RatingBar id={id} sendRating={this.sendRating} updateRatingState={this.updateRatingState} csrf={csrf} />
        <Grid container spacing={0} className={classes.titleBar}>
          <Grid item xs={7} sm={8} md={9} lg={10}>
            <Typography
              component="h2"
              variant="subtitle1"
              title={title}
              className={classes.paintingTitle}
            >
              {title}
            </Typography>
          </Grid>
          <Grid item xs={5} sm={4} md={3} lg={2} className={classes.options}>
            <IconButton
              className={classes.iconButton}
              aria-label="Bookmark Image"
              onClick={this.bookmarkImage}
              title="Bookmark Image"
            >
              {bookmarked ? (
                <BookmarkIcon fontSize="large" />
              ) : (
                <BookmarkBorderIcon fontSize="large" />
              )}
            </IconButton>
            <a href={url} rel="noopener noreferrer" target="_blank" title="Harvard Site">
              <IconButton className={classes.iconButton} aria-label="Link to Harvard Site">
                <OpenInNewIcon fontSize="large" />
              </IconButton>
            </a>
          </Grid>
        </Grid>
      </div>
    );
  }
}

Application.defaultProps = {
  csrf: ''
};

Application.propTypes = {
  classes: PropTypes.shape().isRequired,
  csrf: PropTypes.string,
  updateLogin: PropTypes.func.isRequired
};

export default withStyles(styles)(Application);
