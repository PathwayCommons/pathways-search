import React from 'react';
import h from 'react-hyperscript';
import {Modal, Image, Media} from 'react-bootstrap';

// Splash
// Prop Dependencies ::
// - none
export class Splash extends React.Component {
  render() {
    return (
      h('div.Splash', [
        h(Modal.Dialog, {
          className: 'splashModal'
        }, [
          h(Modal.Body, [
            h('p.lead splashText', [
              'Signalling pathways, metabolic pathways and gene regulator networks from',
              h('a', {
                href: 'http://www.pathwaycommons.org/pc2/datasources',
                target: '_blank'
              },'public pathway databases'),
              h(Image, {
                className: 'splashImage',
                src: 'img/splash_infographic.svg',
              })
            ])
          ]),
          h(Modal.Footer, [
            h(Media, [
              h(Media.Body, [
                h(Media.Heading, [
                  h('span#pc-link', [
                    h('a', {
                      href: 'http://www.pathwaycommons.org',
                      target: '_blank'
                    }, 'Pathway Commons')
                  ])
                ]),
                h('span#pub-link', [
                  h('a', {
                    href: 'https://www.ncbi.nlm.nih.gov/pmc/articles/PMC3013659/',
                    target: '_blank'
                  }, 'A web resource for biological pathway data')
                ])
              ]),
              h(Media.Right, [
                h('img', {
                  width: 48,
                  height: 48,
                  src: 'img/pc_logo_dark.svg',
                  alt: 'Image'
                })
              ])
            ])
          ])
        ])
      ])
    );
  }
}
