import { describe, it, expect, vi} from "vitest";
import {
  act,
  fireEvent,
  render,
  screen,
  waitFor,
} from "@testing-library/react";
import App from "./App";

import "vitest-canvas-mock";
import userEvent from "@testing-library/user-event";

const ResizeObserverMock = vi.fn(() => ({
  observe: vi.fn(),
  unobserve: vi.fn(),
  disconnect: vi.fn(),
}));

vi.stubGlobal("ResizeObserver", ResizeObserverMock);

describe("Test", async () => {

  // beforeEach(() => {
  //   window.history.pushState({}, "", "/");
  // });
  const mockListOfUsersWithSize = {
    users: [ {
      id: 1,
      username: "Cosmin Timis",
      email: "cosmin.timis@gmail.com",
      avatar:
    "https://robohash.org/e5a84795597420d98d606433f8ad1f70?set=set4&bgset=&size=400x400",
      password: "parolaaiabuna",
      birthdate: new Date("2003-01-01"),
      rating: 8.8,
      address: "address1",
    },
    {
      id: 2,
      username: "Roberto Pitic",
      email: "roberto.pitic@gmail.com",
      avatar:
      "https://robohash.org/123a37a18fdbba6a742e7446c8166393?set=set4&bgset=&size=400x400",
      password: "parola2004",
      birthdate: new Date("2004-01-01"),
      rating: 9.4,
      address: "Moisei gara",
    },
  ],
  size: 2,   
};
  const api = {
    addUser: vi.fn().mockReturnValue({}),
    deleteUser: vi.fn().mockReturnValue({}),
    updateUser: vi.fn().mockReturnValue({}),
    getUsers: vi.fn().mockReturnValue(mockListOfUsersWithSize),
    getUser: vi.fn().mockReturnValue(mockListOfUsersWithSize.users[0]),
    getBirthsPerYear: vi.fn().mockReturnValue({ "2003": 1, "2004": 1 }),
  };

  it("Should delete first user", async () => {
    render(<App api={api} />);

    await waitFor(() => screen.getAllByTestId("carousel-card-test"));

    var allCardsWithSameName = screen.getAllByTestId("carousel-card-test");

    expect(allCardsWithSameName.length).toBe(2);

    const actualFirstUser = allCardsWithSameName[0];

    const deleteButton =
      actualFirstUser.parentElement?.querySelector("svg.delete-btn");

    expect(deleteButton).toBeInTheDocument();

    act(() => {
      fireEvent.click(deleteButton!);
    });

    await waitFor(() => expect(api.deleteUser).toHaveBeenCalledTimes(1));

    allCardsWithSameName = screen.getAllByTestId("carousel-card-test");

    expect(allCardsWithSameName.length).toBe(1);
  });

  it("Should update first user name", async () => {
    render(<App api={api} />);
  
    const firstUser = mockListOfUsersWithSize.users[0];
    await waitFor(() => screen.getAllByTestId("carousel-card-test"));
    
    const firstUserCard = screen.getByText(firstUser.username);

    const updateButton = firstUserCard.parentElement?.querySelector('svg.update-btn');
    const newUserName = "cosmin1234";

   
    act(() => {
      fireEvent.click(updateButton!);
    });
  
    const inputUsername = screen.getByTestId('input-username-update');
    const submitButton = screen.getByTestId('submit-update-btn');

    expect(inputUsername).toBeInTheDocument();
    expect(submitButton).toBeInTheDocument();

   
    act(() => {
      userEvent.type(inputUsername, newUserName);
      userEvent.click(submitButton);
    });

    await waitFor(() => expect(api.updateUser).toHaveBeenCalledTimes(1));

    const linkHomePage = screen.getByTestId('link-home-page');
    act(() => {
      fireEvent.click(linkHomePage);
    });

  });

  it("Should add a new user", async () => {
    render(<App api={api} />);

    //go to add user page
    const link = await screen.getByTestId('add-new-user-page');
    act(() => {
      fireEvent.click(link);
    });

    const inputUsername = screen.getByTestId('input-username');
    const inputEmail = screen.getByTestId('input-email');
    const inputPassword = screen.getByTestId('input-password');
    const inputAvatar = screen.getByTestId('input-avatar');
    const inputGrade = screen.getByTestId('input-grade');
    const inputAddress = screen.getByTestId('input-address');
    const submitButton = screen.getByTestId('submit-add-btn');

    act(() => {
      fireEvent.change(inputUsername, { target: { value: "test2024" } });
      fireEvent.change(inputEmail, { target: { value: "test2024@gmail.com" } });
      fireEvent.change(inputPassword, { target: { value: "test2024" } });
      fireEvent.change(inputAvatar, { target: { value: "test" } });
      fireEvent.change(inputGrade, { target: { value: "7.5" } });
      fireEvent.change(inputAddress, { target: { value: "test" } });
      fireEvent.click(submitButton);
    }
    );

    await waitFor(() => expect(api.addUser).toHaveBeenCalledTimes(1));

   
    /// return to home page
    const linkHomePage = screen.getByTestId('link-home-page');
    act(() => {
      fireEvent.click(linkHomePage);
    });

  });
  it("test search filter", async () => {
    render(<App api={api} />);

    const input = screen.getByTestId('search-test');

    const filtedUsers = mockListOfUsersWithSize.users.filter(user => user.username.includes("Cosmin"));
    expect(filtedUsers.length).toBe(1);

    api.getUsers.mockReturnValue({ users: filtedUsers, size: 1 });

    act(() => {
      fireEvent.change(input, { target: { value: "Cosmin" } });
    });

    await waitFor(() => expect(api.getUsers).toHaveBeenCalled());

    const cards = screen.getAllByTestId('carousel-card-test');
    expect(cards.length).toBe(1);

    api.getUsers.mockReturnValue(mockListOfUsersWithSize);
  
  });

  it("test pagination", async () => {
    render(<App api={api} />);

    const prevBtn = screen.getByTestId('prev-btn');
    const nextBtn = screen.getByTestId('next-btn');

    expect(prevBtn).toBeInTheDocument();
    expect(nextBtn).toBeInTheDocument();

    act(() => {
      fireEvent.click(nextBtn);
    });

    const alertContainer = screen.getByTestId('alert-container-test');
    expect(alertContainer).toBeInTheDocument();
    expect(alertContainer.textContent).toBe('There are no more pages!');


    await new Promise((r) => setTimeout(r, 3000));
    expect(alertContainer.textContent).toBe('');

 });

  it("test bar chart", async () => {
    render(<App api={api} />);

    const barChart = screen.getByTestId('bar-chart-test-id');
    expect(barChart).toBeInTheDocument();
    expect(barChart.querySelector('canvas')).toBeInTheDocument();
  });

  it("test dropdown", async () => {

    render(<App api={api} />);

    let dropdownBtn = screen.getByTestId('dropdown-btn-test-id');
    expect(dropdownBtn).toBeInTheDocument();
    expect(dropdownBtn.getAttribute('data-state')).toBe('closed');

    const user = userEvent.setup();

    await user.click(dropdownBtn);

    expect(dropdownBtn.getAttribute('data-state')).toBe('open');

    const dropdownItems = screen.getAllByTestId('dropdown-item-test-id');
    expect(dropdownItems.length).toBe(1);

  }
  );
});
