import { describe, it, expect, vi } from "vitest";
import {
  act,
  fireEvent,
  render,
  screen,
  waitFor,
} from "@testing-library/react";
import React from "react";
import App from "./App";
import { RouterProvider, createBrowserRouter } from "react-router-dom";
import UpdatePage from "./pages/update-page";
import AddUserPage from "./pages/add-user-page";
import { USERS as initialUserList } from "@/constants/user";
import "vitest-canvas-mock";
import userEvent from "@testing-library/user-event";
import { mock } from "node:test";
import { time } from "console";

const ResizeObserverMock = vi.fn(() => ({
  observe: vi.fn(),
  unobserve: vi.fn(),
  disconnect: vi.fn(),
}));

vi.stubGlobal("ResizeObserver", ResizeObserverMock);

describe("Test", async () => {
  const mockListOfUsers = [
    {
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
  ];
  const api = {
    addUser: vi.fn(),
    deleteUser: vi.fn(),
    updateUser: vi.fn(),
    getUsers: vi.fn().mockReturnValue(mockListOfUsers),
    getUser: vi.fn().mockReturnValue(mockListOfUsers[0]),
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

    fireEvent.click(deleteButton!);

    await waitFor(() => expect(api.deleteUser).toHaveBeenCalledTimes(1));

    allCardsWithSameName = screen.getAllByTestId("carousel-card-test");

    expect(allCardsWithSameName.length).toBe(1);
  });

  it("Should update first user name", async () => {
    render(<App api={api} />);
  
    const firstUser = mockListOfUsers[0];
    await waitFor(() => screen.getAllByTestId("carousel-card-test"));
    
    const firstUserCard = screen.getByText(firstUser.username);

    const updateButton = firstUserCard.parentElement?.querySelector('svg.update-btn');
    const newUserName = "cosmin1234";

   
    fireEvent.click(updateButton!);
  
    const inputUsername = screen.getByTestId('input-username-update');
    const submitButton = screen.getByTestId('submit-update-btn');

    expect(inputUsername).toBeInTheDocument();
    expect(submitButton).toBeInTheDocument();

   
    act(() => {
      userEvent.type(inputUsername, newUserName);
      userEvent.click(submitButton);
    });

    await waitFor(() => expect(api.updateUser).toHaveBeenCalledTimes(1));

  });

  // it("Should add a new user", async () => {
  //   render(
  //     <React.StrictMode>
  //       <RouterProvider router={router} />
  //     </React.StrictMode>
  //   );

  //   // go to add user page
  //   const link = screen.getByTestId('add-new-user-page');
  //   act(() => {
  //     fireEvent.click(link);
  //   });

  //   const inputUserid = screen.getByTestId('input-userid');
  //   const inputUsername = screen.getByTestId('input-username');
  //   const inputEmail = screen.getByTestId('input-email');
  //   const inputPassword = screen.getByTestId('input-password');
  //   const inputAvatar = screen.getByTestId('input-avatar');
  //   const inputGrade = screen.getByTestId('input-grade');
  //   const inputAddress = screen.getByTestId('input-address');
  //   const submitButton = screen.getByTestId('submit-add-btn');

  //   act(() => {
  //     fireEvent.change(inputUserid, { target: { value: "123" } });
  //     fireEvent.change(inputUsername, { target: { value: "cosmin" } });
  //     fireEvent.change(inputEmail, { target: { value: "test@gmail.com" } });
  //     fireEvent.change(inputPassword, { target: { value: "1234" } });
  //     fireEvent.change(inputAvatar, { target: { value: "test" } });
  //     fireEvent.change(inputGrade, { target: { value: "7.5" } });
  //     fireEvent.change(inputAddress, { target: { value: "test" } });
  //     fireEvent.click(submitButton);
  //   }
  //   );

  //   await act(async () => { });

  //   expect(initialUserList.length).toBe(11);

  //   /// return to home page
  //   const linkHomePage = screen.getByTestId('link-home-page');
  //   act(() => {
  //     fireEvent.click(linkHomePage);
  //   });
  // });

  // it("test search filter", async () => {
  //   render(
  //     <React.StrictMode>
  //       <RouterProvider router={router} />
  //     </React.StrictMode>
  //   );

  //   const input = screen.getByTestId('search-test');

  //   const firstUserName = initialUserList[0].username;

  //   act(() => {
  //     fireEvent.change(input, { target: { value: firstUserName } });
  //   });

  //   await act(async () => { });

  //   const firstPage = initialUserList.slice(0, 4);
  //   const filteredList = firstPage.filter(user => user.username.includes(firstUserName));

  //   const cards = screen.getAllByTestId('carousel-card-test');
  //   expect(cards.length).toBe(filteredList.length*2);

  // });

  // it("test pagination", async () => {
  //   render(
  //     <React.StrictMode>
  //       <RouterProvider router={router} />
  //     </React.StrictMode>
  //   );

  //   const currentPage = screen.getByTestId('page-number');
  //   expect(currentPage.textContent).toBe("Page: 1");
  //   expect(initialUserList.length).toBeGreaterThanOrEqual(8);

  //   let cards = screen.getAllByTestId('carousel-card-test');
  //   expect(cards.length).toBe(10);
  //   expect(screen.getAllByText(initialUserList[0].username)[0]).toBeInTheDocument();
  //   expect(screen.getAllByText(initialUserList[1].username)[0]).toBeInTheDocument();
  //   expect(screen.getAllByText(initialUserList[2].username)[0]).toBeInTheDocument();
  //   expect(screen.getAllByText(initialUserList[3].username)[0]).toBeInTheDocument();
  //   expect(screen.getAllByText(initialUserList[4].username)[0]).toBeInTheDocument();

  //   const nextButton = screen.getByTestId('next-btn');

  //   act(() => {
  //     fireEvent.click(nextButton);
  //   });

  //   await act(async () => { });

  //   expect(currentPage.textContent).toBe("Page: 2");
  //   cards = screen.getAllByTestId('carousel-card-test');
  //   expect(cards.length).toBe(10);
  //   expect(screen.getAllByText(initialUserList[5].username)[0]).toBeInTheDocument();
  //   expect(screen.getAllByText(initialUserList[6].username)[0]).toBeInTheDocument();
  //   expect(screen.getAllByText(initialUserList[7].username)[0]).toBeInTheDocument();
  //   expect(screen.getAllByText(initialUserList[8].username)[0]).toBeInTheDocument();
  //   expect(screen.getAllByText(initialUserList[9].username)[0]).toBeInTheDocument();

  //   const prevButton = screen.getByTestId('prev-btn');

  //   act(() => {
  //     fireEvent.click(prevButton);
  //   }
  //   );

  //   await act(async () => { });

  //   expect(currentPage.textContent).toBe("Page: 1");
  //   expect(cards.length).toBe(10);
  //   expect(screen.getAllByText(initialUserList[0].username)[0]).toBeInTheDocument();
  //   expect(screen.getAllByText(initialUserList[1].username)[0]).toBeInTheDocument();
  //   expect(screen.getAllByText(initialUserList[2].username)[0]).toBeInTheDocument();
  //   expect(screen.getAllByText(initialUserList[3].username)[0]).toBeInTheDocument();
  //   expect(screen.getAllByText(initialUserList[4].username)[0]).toBeInTheDocument();

  // });

  // it("test bar chart", async () => {
  //   render(
  //     <React.StrictMode>
  //       <RouterProvider router={router} />
  //     </React.StrictMode>
  //   );

  //   const barChart = screen.getByTestId('bar-chart-test-id');
  //   expect(barChart).toBeInTheDocument();
  //   expect(barChart.querySelector('canvas')).toBeInTheDocument();
  // });

  // it("test dropdown", async () => {
  //   render(
  //     <React.StrictMode>
  //       <RouterProvider router={router} />
  //     </React.StrictMode>
  //   );

  //   let cards = screen.getAllByTestId('carousel-card-test');
  //   expect(cards.length).toBe(10);

  //   let dropdownBtn = screen.getByTestId('dropdown-btn-test-id');
  //   expect(dropdownBtn).toBeInTheDocument();
  //   expect(dropdownBtn.getAttribute('data-state')).toBe('closed');

  //   const user = userEvent.setup();

  //   await user.click(dropdownBtn);

  //   expect(dropdownBtn.getAttribute('data-state')).toBe('open');

  //   const dropdownItems = screen.getAllByTestId('dropdown-item-test-id');
  //   expect(dropdownItems.length).toBe(2);

  //   const dropdownItem = dropdownItems[1];
  //   expect(dropdownItem).toBeInTheDocument();

  //   await user.click(dropdownItem);

  //   cards = screen.getAllByTestId('carousel-card-test');
  //   expect(cards.length).toBe(20);
  // }
  // );
});
