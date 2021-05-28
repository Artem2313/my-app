import React, { RefObject, useEffect, useRef, useState } from 'react';
import cc from 'classnames';
import './App.css';

function getRefValue(ref: RefObject<any>) {
  return ref.current;
}

export default function App() {
  const firstTimeContainer = useRef<HTMLDivElement>(null);
  const secondTimeContainer = useRef<HTMLDivElement>(null);
  const [showFirstTime, setShowFirstTime] = useState<boolean>(false);
  const [showSecondTime, setShowSecondTime] = useState<boolean>(false);

  useEffect(() => {
    const containers = [firstTimeContainer, secondTimeContainer];
    const containersLen = containers.length;
    let shownCount = 0;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          // only show containers if within user point of view
          if (!entry.isIntersecting) {
            return;
          }

          const {target} = entry;
          const isFirstIntersecting = target.contains(firstTimeContainer.current);
          const isSecondIntersecting = target.contains(secondTimeContainer.current);

          if (!isFirstIntersecting && !isSecondIntersecting) {
            return;
          }

          if (isFirstIntersecting) {
            setShowFirstTime(true);
          } else if (isSecondIntersecting) {
            setShowSecondTime(true);
          }

          observer.unobserve(entry.target);

          // disconnect observer once all containers are shown
          if (containersLen === ++shownCount) {
            observer.disconnect();
          }
        });
      },
      {threshold: 1}
    );

    containers.forEach((nodeRef) => {
      const node = getRefValue(nodeRef);

      // observe parent container is fully seen on user point of view
      // only then animate to show the great times
      if (node.parentElement) {
        observer.observe(node.parentElement);
      }
    });

    return () => {
      observer.disconnect();
    };
  }, []);

  return (
    <div className="steps">
      <div className="steps__container">
        <div className="steps__section-left">
          <div className="steps__content">
            <h3 className="steps__title">Start Hello</h3>
          </div>
        </div>
        <div
          ref={firstTimeContainer}
          className={cc('steps__section-right', {'steps--animate': showFirstTime})}
        >
          <h3 className="steps__section-right__title">Hello 2</h3>
          <p className="steps__section-right__text">
            Lorem ipsum dolor sit amet, consectetur adipisicing elit. Voluptas quisquam ipsa
            commodi quidem totam. Culpa numquam itaque, sunt commodi harum esse id placeat. Autem sint aspernatur dolores doloremque nulla aperiam?
          </p>
          <div className="steps__content-circle">1</div>
        </div>
      </div>
      <div className="steps__container">
        <div className="steps__section-left steps__section-left--margin-right">
          <div className="steps__content">
            <h3 className="steps__title">Lorem</h3>
          </div>
        </div>
        <div
          ref={secondTimeContainer}
          className={cc('steps__section-right', {'steps--animate': showSecondTime})}
        >
          <h3 className="steps__section-right__title">Hello 2</h3>
          <p className="steps__section-right__text">
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Asperiores
            ratione eveniet corrupti natus in rerum, maiores iure atque debitis,
            alias, incidunt consequuntur ducimus perspiciatis ut earum exercitationem. Voluptas, qui quasi.
          </p>
          <div className="steps__content-circle">2</div>
        </div>
      </div>
      <div className="steps__container">
        <div className="steps__section-left steps__section-left--top">
          <div className="steps__content">
            <h3 className="steps__title">Lorem</h3>
          </div>
        </div>
      </div>
      <div className="steps__container">
        <div className="steps__section-left steps__section-left--bottom">
          <div className="steps__content">
            <h3 className="steps__title">Lorem</h3>
          </div>
        </div>
      </div>
      <div className="steps__container">
        <div className="steps__key-circle">
        </div>
        <div className="steps__content steps__content--last">
          <h3 className="steps__title steps__title--last">Lorem</h3>
          <div className="steps__keys-container">
          </div>
          <div className="steps__ellipse"></div>
        </div>
      </div>
    </div>
  );
}

