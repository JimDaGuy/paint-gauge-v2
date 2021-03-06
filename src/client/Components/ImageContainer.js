import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import CircularProgress from '@material-ui/core/CircularProgress';
import defaultImage from '../Assets/profile.png';

const styles = theme => ({
  container: {
    backgroundColor: '#000000',
    height: '250px',
    display: 'flex',
    justifyContent: 'center',
    alignContent: 'center',
    justifyItems: 'center',
    alignItems: 'center'
  },
  overlay: {
    backgroundColor: '#000000',
    opacity: '.6',
    width: '100%',
    height: '250px',
    position: 'absolute',
    top: '60',
    display: 'flex',
    justifyContent: 'center',
    alignContent: 'center',
    justifyItems: 'center',
    alignItems: 'center'
  },
  progress: {
    width: '50px',
    height: '50px'
  },
  imageContainer: {
    width: '100%',
    height: '100%',
    display: 'flex',
    justifyContent: 'center',
    alignContent: 'center',
    justifyItems: 'center',
    alignItems: 'center'
  },
  image: {
    maxWidth: '100%',
    height: '100%'
  },
  [theme.breakpoints.up('sm')]: {
    overlay: {
      height: '300px'
    },
    container: {
      height: '300px'
    }
  },
  [theme.breakpoints.up('md')]: {
    overlay: {
      height: '350px'
    },
    container: {
      height: '350px'
    }
  },
  [theme.breakpoints.up('lg')]: {
    overlay: {
      height: '450px'
    },
    container: {
      height: '450px'
    }
  }
});

class ImageContainer extends React.Component {
  constructor(props) {
    super(props);

    this.imageContainer = React.createRef();

    this.state = {};
  }

  componentDidMount() {
    const { setLoading } = this.props;
    setLoading(true);
  }

  componentDidUpdate(prevProps) {
    const {
      classes, imageURL, imageAlt, setLoading
    } = this.props;
    if (imageURL !== prevProps.imageURL) {
      if (imageURL !== null) {
        const imageContainer = this.imageContainer.current;
        imageContainer.innerHTML = '';
        const image = new Image();
        image.onload = () => {
          setLoading(false);
        };
        image.src = imageURL;
        image.alt = imageAlt;
        // image.title = imageAlt;
        image.className = classes.image;
        imageContainer.appendChild(image);
      } else {
        const imageContainer = this.imageContainer.current;
        imageContainer.innerHTML = '';
      }
    }
  }

  render() {
    const {
      classes, imageURL, imageAlt, loading
    } = this.props;

    return (
      <div className={`${classes.container}`}>
        {loading === true || imageURL === null ? (
          <div className={`${classes.overlay}`}>
            {loading === true ? (
              <CircularProgress className={classes.progress} color="secondary" />
            ) : null}
          </div>
        ) : null}
        {imageURL === null ? (
          <img src={defaultImage} alt={imageAlt} className={`${classes.image}`} />
        ) : null}
        <div
          ref={this.imageContainer}
          className={imageURL !== null ? classes.imageContainer : null}
        />
      </div>
    );
  }
}

ImageContainer.defaultProps = {
  imageURL: null,
  imageAlt: 'Default Image Title',
  loading: true
};

ImageContainer.propTypes = {
  classes: PropTypes.shape().isRequired,
  imageURL: PropTypes.string,
  imageAlt: PropTypes.string,
  loading: PropTypes.bool,
  setLoading: PropTypes.func.isRequired
};

export default withStyles(styles)(ImageContainer);
