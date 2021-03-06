// @flow
/* eslint-disable react/no-multi-comp */
import React, { Component } from 'react';
import { storiesOf } from '@storybook/react';
import Paging from '../Paging';

storiesOf('Paging', module)
  .addDecorator(story =>
    <div>
      {story()}
    </div>
  )
  .add('GoToAbsensePage', () => <GoToAbsensePage />)
  .add('SimpleSamples', () => {
    return (
      <div>
        <PagingWithState pagesCount={1} />
        <PagingWithState pagesCount={7} />
        <PagingWithState pagesCount={8} />
        <PagingWithState pagesCount={12} />
      </div>
    );
  })
  .add('PagingWithCustomComponent', () =>
    <PagingWithCustomComponent pagesCount={12} />
  );

class GoToAbsensePage extends Component {
  state = {
    activePage: 3
  };
  render() {
    let pagesCount = this._getPagesCount(this.state.activePage);
    return (
      <div>
        <div style={{ textAlign: 'center' }}>
          <Paging
            activePage={this.state.activePage}
            pagesCount={pagesCount}
            onPageChange={this._handlePageChange}
          />
        </div>
      </div>
    );
  }
  _getPagesCount = (activePage: number) => {
    return activePage <= 4 ? 7 : 5;
  };
  _handlePageChange = (pageNumber: number) => {
    let pagesCount = this._getPagesCount(pageNumber);
    let activePage = Math.min(pageNumber, pagesCount);
    this.setState({ activePage });
  };
}

class PagingWithState extends Component {
  state = {
    activePage: 1
  };
  render() {
    return (
      <div>
        <Paging
          activePage={this.state.activePage}
          pagesCount={this.props.pagesCount}
          onPageChange={this._handlePageChange}
        />
      </div>
    );
  }
  _handlePageChange = (pageNumber: number) => {
    this.setState({ activePage: pageNumber });
  };
}

const CustomComponent = props =>
  Paging.isForward(props.pageNumber)
    ? <a href={'#' + (props.pageNumber + 1)} {...props} />
    : <a href={'#' + props.pageNumber} {...props} />;

class PagingWithCustomComponent extends Component {
  state = {
    activePage: 1
  };
  render() {
    return (
      <div>
        <Paging
          activePage={this.state.activePage}
          pagesCount={this.props.pagesCount}
          onPageChange={this._handlePageChange}
          component={CustomComponent}
        />
      </div>
    );
  }
  _handlePageChange = (pageNumber: number) => {
    this.setState({ activePage: pageNumber });
  };
}
