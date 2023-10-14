const mongoose = require('mongoose');
//Models
const Video = require('../models/video');
const Apikey = require('../models/apikey');

const createKey = (data) => {
  return new Promise((resolve, reject) => {
    const apikey = new Apikey(data);
    apikey.save()
      .then((newKey) => {
        resolve(newKey);
      })
      .catch((error) => {
        reject(error);
      });
  });
};

const getKeys = () => {
  return new Promise((resolve, reject) => {
    Apikey.find()
      .then((apikeys) => {
        resolve(apikeys);
      })
      .catch((error) => {
        reject(error);
      });
  });
};

const createVideo = (videoData) => {
  return new Promise((resolve, reject) => {
    const video = new Video(videoData);
    video.save()
      .then((newVid) => {
        resolve(newVid);
      })
      .catch((error) => {
        reject(error);
      });
  });
};

const getVideos = () => {
  return new Promise((resolve, reject) => {
    Video.find()
      .then((videos) => {
        resolve(videos);
      })
      .catch((error) => {
        reject(error);
      });
  });
};

const updateKey = (userId, userData) => {
  return new Promise((resolve, reject) => {
    Apikey.findByIdAndUpdate(userId, userData, { new: true })
      .then((ld) => {
        if (!ld) {
          throw new Error('User not found');
        }
        resolve(ld);
      })
      .catch((error) => {
        reject(error);
      });
  });
};

const deleteVideo = (vId) => {
  return new Promise((resolve, reject) => {
    Video.findByIdAndDelete(vId)
      .then((vid) => {
        if (!vid) {
          throw new Error('User not found');
        }
        resolve(vid);
      })
      .catch((error) => {
        reject(error);
      });
  });
};

const deleteKey = (userId) => {
  return new Promise((resolve, reject) => {
    Apikey.findByIdAndDelete(userId)
      .then((apikey) => {
        if (!apikey) {
          throw new Error('Key not found');
        }
        resolve(apikey);
      })
      .catch((error) => {
        reject(error);
      });
  });
};


module.exports = {
  createVideo,
  getVideos,
  createKey,
  getKeys,
  deleteVideo,
  deleteKey, 
  updateKey     
};
