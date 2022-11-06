import * as React from 'react';
import dataService, { Recipe, RecipeInfo, Ingredient } from '../src/DataService';
import { shallow } from 'enzyme';
import { MemoryRouter, NavLink } from 'react-router-dom';
import { Home } from '../src/pages/Home';
import { DisplayOne } from '../src/pages/DisplayOne';
import { EditRecipes } from '../src/pages/EditRecipes';
import Explore from '../src/pages/Explore';
import { ShoppingCart } from '../src/pages/ShoppingCart';
import { CreateNew } from '../src/pages/CreateNew';

import { render, unmountComponentAtNode } from 'react-dom';
import { act } from 'react-dom/test-utils';
import { tupleExpression } from '@babel/types';
import { screen, fireEvent } from '@testing-library/react';

let container: any = null;
beforeEach(() => {
  // setup a DOM element as a render target
  container = document.createElement('div');
  document.body.appendChild(container);
});

afterEach(() => {
  // cleanup on exiting
  unmountComponentAtNode(container);
  container.remove();
  container = null;
});

jest.mock('../src/DataService', () => {
  class DataService {
    /* Get a specific recipe with known id */
    get(id: string) {
      return Promise.resolve({
        recipeInfo: {
          id: 1,
          name: 'One-Pot Mac and Cheese',
          meal_type: 'Dinner',
          new: true,
          popular: true,
          description: `Who likes cleaning up after making mac and cheese? 
              Not this girl. This one-pot mac and cheese is a family favorite, 
              and my 3-year-old is thrilled to see it coming to the dinner table. 
              We love to add sliced smoked sausage to this creamy mac recipe!`,
        },
        ingredients: [
          {
            ingredients_id: 1,
            ingredient: 'whole milk',
            amount: 1.5,
            unit_id: 2,
            unit: 'cup',
          },
          {
            ingredients_id: 2,
            ingredient: 'water',
            amount: 3,
            unit_id: 2,
            unit: 'cup',
          },
          {
            ingredients_id: 3,
            ingredient: 'elbow macaroni (16 ounces)',
            amount: 1,
            unit_id: 3,
            unit: 'package',
          },
          {
            ingredients_id: 4,
            ingredient: 'velveeta, cubed',
            amount: 4,
            unit_id: 4,
            unit: 'ounce',
          },
          {
            ingredients_id: 5,
            ingredient: 'shredded sharp cheddar cheese',
            amount: 2,
            unit_id: 2,
            unit: 'cup',
          },
          {
            ingredients_id: 6,
            ingredient: 'salt',
            amount: 0.5,
            unit_id: 5,
            unit: 'teaspoon',
          },
          {
            ingredients_id: 7,
            ingredient: 'coarsely ground pepper',
            amount: 0.5,
            unit_id: 5,
            unit: 'teaspoon',
          },
        ],
      });
    }

    // Get an array of all recipes
    getAll() {
      return Promise.resolve([
        {
          id: 1,
          name: 'One-Pot Mac and Cheese',
          meal_type: 'Dinner',
          new: true,
          popular: true,
          description: `Who likes cleaning up after making mac and cheese? 
          Not this girl. This one-pot mac and cheese is a family favorite, 
          and my 3-year-old is thrilled to see it coming to the dinner table. 
          We love to add sliced smoked sausage to this creamy mac recipe!`,
        },
        {
          id: 2,
          name: 'Easy Marinated Grilled Flank Steak',
          meal_type: 'Dinner',
          new: false,
          popular: false,
          description: `Friends shared this three-ingredient marinade years ago, 
          and it’s been a favorite since. Serve the steak with salad and 
          grilled potatoes for a quick meal.`,
        },
      ]);
    }

    /* Post new recepie */
    create() {
      return Promise.resolve(3); // Same as: return new Promise((resolve) => resolve(3));
    }

    edit() {
      return Promise.resolve();
    }

    delete() {
      return Promise.resolve();
    }
  }
  return new DataService();
});

describe('Home page tests', () => {
  test('Home page includes correct static elements', (done) => {
    const wrapper = shallow(<Home />);
    setTimeout(() => {
      expect(
        wrapper.containsAllMatchingElements([
          <h1>Welcome to the Tasty</h1>,
          <p>
            Here you can explore your own recipes by adding new content, editing existing ones and
            deleting the ones you don't care about anymore.
          </p>,
          <p>
            This is also the place to discover more and get inspiration from, we have selected a few
            to show you from [External API] below.
          </p>,
          <div className="Content-second">
            <h5>[Place for external API recipes here]</h5>
          </div>,
        ])
      ).toEqual(true);
      done();
    });
  });
  test('Home page draws correctly (snapshot) including list of buttons', async () => {
    await act(async () => {
      await render(
        <MemoryRouter>
          <Home />
        </MemoryRouter>,
        container
      );
    });
    expect(container).toMatchSnapshot();
  });
});

describe('DisplayOne page tests', () => {
  test('DisplayOne page draws correctly (snapshot) including data from test recipe 1', async () => {
    await act(async () => {
      await render(
        <MemoryRouter>
          <DisplayOne />
        </MemoryRouter>,
        container
      );
    });
    expect(container).toMatchSnapshot();
  });

  test('Changing portions', async () => {
    await act(async () => {
      await render(
        <MemoryRouter>
          <DisplayOne />
        </MemoryRouter>,
        container
      );
    });

    // get hold of the current amount on ingredient 1
    let amount1 = container.querySelector('div table td')?.innerHTML.substring(0, 3);
    expect(amount1).toBe('1.5');

    // get hold of selector
    const selector = container.querySelector('div select');

    // change selector to 6 portions (firing event using react test library)
    fireEvent.change(selector, { target: { value: 6 } });

    // update and check new amount on ingredient 1
    amount1 = container.querySelector('div table td')?.innerHTML.substring(0, 3);
    expect(amount1).toBe('2.3');
  });
});

describe('EditRecipes page tests', () => {
  test('EditRecipes page draws correctly', (done) => {
    const wrapper = shallow(<EditRecipes />);
    setTimeout(() => {
      expect(wrapper).toMatchSnapshot();
      done();
    });
  });
});

describe('Explore page tests', () => {
  test('Explore page draws correctly', (done) => {
    const wrapper = shallow(<Explore />);
    setTimeout(() => {
      expect(wrapper).toMatchSnapshot();
      done();
    });
  });
});

describe('ShoppingCart page tests', () => {
  test('ShoppingCart page draws correctly', (done) => {
    const wrapper = shallow(<ShoppingCart />);
    setTimeout(() => {
      expect(wrapper).toMatchSnapshot();
      done();
    });
  });
});

describe('CreateNew page tests', () => {
  test('CreateNew page draws correctly', (done) => {
    const wrapper = shallow(<CreateNew />);
    setTimeout(() => {
      expect(wrapper).toMatchSnapshot();
      done();
    });
  });
});