const models = require('../models');

const { Rating, Bookmark } = models;

// eslint-disable-next-line consistent-return
const setRating = (req, res) => {
  if (!req.body.imageID || !req.body.rating) {
    return res.status(400).json({ error: 'imageID and rating parameters are required' });
  }

  const userID = req.session.account._id; // eslint-disable-line no-underscore-dangle
  const { imageID, rating } = req.body;

  // Check if user has already submitted rating for this image
  // eslint-disable-next-line consistent-return
  Rating.RatingModel.checkRating(req.session.account, imageID, (err, result) => {
    if (err) return res.status(400).json({ error: 'Error checking if rating already exists' });
    // Create new rating or update existing rating
    if (!result || result.length < 1) {
      const ratingDetails = { userID, imageID, rating };

      const ratingObj = new Rating.RatingModel(ratingDetails);

      const ratingPromise = ratingObj.save();

      ratingPromise.then(() => res.status(200).json({ message: 'Rating successfully saved' }));

      ratingPromise.catch(() => res.status(400).json({ error: 'Error saving rating to the database' }));
    } else {
      Rating.RatingModel.updateRating(req.session.account, imageID, rating, (err2) => {
        if (err2) return res.status(400).json({ error: 'Error updating existing rating' });

        return res.status(200).json({ message: 'Rating successfully updated' });
      });
    }
  });
};

// eslint-disable-next-line consistent-return
const setBookmark = (req, res) => {
  if (!req.body.imageID) {
    return res.status(400).json({ error: 'imageID parameter is required' });
  }

  const userID = req.session.account._id; // eslint-disable-line no-underscore-dangle
  const { imageID } = req.body;

  // Check if user has already submitted bookmark for this image
  // eslint-disable-next-line consistent-return
  Bookmark.BookmarkModel.checkBookmark(req.session.account, imageID, (err, result) => {
    if (err) return res.status(400).json({ error: 'Error checking if bookmark already exists' });

    // Create new bookmark or update existing bookmark
    if (!result || result.length < 1) {
      const bookmarkDetails = { userID, imageID };

      const bookmarkObj = new Bookmark.BookmarkModel(bookmarkDetails);

      const bookmarkPromise = bookmarkObj.save();

      bookmarkPromise.then(() => res.status(200).json({ message: 'Bookmark successfully saved' }));

      bookmarkPromise.catch(() => res.status(400).json({ error: 'Error saving bookmark to the database' }));
    } else {
      Bookmark.BookmarkModel.removeBookmark(req.session.account, imageID, (err2) => {
        if (err2) return res.status(400).json({ error: 'Error removing existing bookmark' });

        return res.status(200).json({ message: 'Bookmark successfully removed' });
      });
    }
  });
};

// eslint-disable-next-line consistent-return
const checkBookmark = (req, res) => {
  if (!req.query.imageID) {
    return res.status(400).json({ error: 'imageID parameter is required' });
  }

  const { imageID } = req.query;

  Bookmark.BookmarkModel.checkBookmark(req.session.account, imageID, (err, result) => {
    if (err) return res.status(400).json({ error: 'Error checking bookmark status' });

    // Return status of bookmark for imageID and user
    if (!result || result.length < 1) {
      return res.status(200).json({ bookmarkStatus: false });
    }

    return res.status(200).json({ bookmarkStatus: true });
  });
};

module.exports = {
  setRating,
  setBookmark,
  checkBookmark
};
