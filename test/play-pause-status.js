// Load in dependencies
var expect = require('chai').expect;
var browserUtils = require('./utils/browser');
var browserMusicUtils = require('./utils/browser-music');

// Start our tests
describe('A new session with Google Music', function () {
  browserUtils.openMusic();

  // TODO: Currently there is no default state, fix that
  it.skip('is not playing any music', function () {
    // Placeholder for linter
  });

  describe('when we are playing music', function () {
    browserUtils.execute(function setupPlaybackWatcher () {
      window.googleMusic.on('change:playback', function saveMode (mode) {
        window.playbackMode = mode;
      });
    });
    browserMusicUtils.playAnything();
    browserMusicUtils.waitForPlaybackStart();
    browserUtils.execute(function getPlaybackState () {
      return window.playbackMode;
    });

    it('lists the music as playing', function () {
      expect(this.result).to.equal(2 /* PLAYING */);
    });

    describe('and pause it', function () {
      before(function pausePlayback (done) {
        // Find and click the I'm Feeling Lucky mix
        var browser = this.browser;
        browser.elementByCssSelector('[data-id=play-pause]', function handleElement (err, el) {
          // If there was an error, callback with it
          if (err) {
            return done(err);
          }

          // Otherwise, click our element
          el.click(done);
        });
      });
      browserMusicUtils.waitForPlaybackPause();
      browserUtils.execute(function getPlaybackState () {
        return window.playbackMode;
      });

      it('lists the music as paused', function () {
        expect(this.result).to.equal(1 /* PAUSED */);
      });

      describe('and when we clear the queue (aka the only way to stop)', function () {
        before(function clearQueue (done) {
          // Find and click the button to view the queue
          var browser = this.browser;
          browser.elementByCssSelector('#queue', function handleElement (err, openEl) {
            // If there was an error, callback with it
            if (err) {
              return done(err);
            }

            // Otherwise, click our element
            openEl.click(function handleClick (err) {
              // If there was an error, callback with it
              if (err) {
                return done(err);
              }

              // Find and click the button to clear our queue
              browser.elementByCssSelector('[data-id=clear-queue]', function handleElement (err, clearEl) {
                // If there was an error, callback with it
                if (err) {
                  return done(err);
                }

                // Otherwise, click our element
                clearEl.click(done);
              });
            });
          });
        });
        browserUtils.execute(function getPlaybackState () {
          return window.playbackMode;
        });

        it('lists the music as stopped', function () {
          expect(this.result).to.equal(0 /* STOPPED */);
        });
      });
    });
  });
});
