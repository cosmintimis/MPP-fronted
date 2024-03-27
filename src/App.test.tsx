import { describe, it, expect, vi } from "vitest";
import { act, fireEvent, render, screen } from "@testing-library/react";
import React from "react";
import App from "./App";
import { RouterProvider, createBrowserRouter } from "react-router-dom";
import UpdatePage from "./pages/update-page";
import AddUserPage from "./pages/add-user-page";
import { USERS as initialUserList } from "@/constants/user";
import 'vitest-canvas-mock';
import userEvent from '@testing-library/user-event';

const router = createBrowserRouter([
  {
    path: '/',
    element: <App />
  },
  {
    path: "/update/:userId",
    element: <UpdatePage />
  },
  {
    path: "/addUser",
    element: <AddUserPage />
  }

]);

const ResizeObserverMock = vi.fn(() => ({
  observe: vi.fn(),
  unobserve: vi.fn(),
  disconnect: vi.fn(),
}));

vi.stubGlobal('ResizeObserver', ResizeObserverMock);

describe("Test", async () => {

 
  it("Should delete first user", async () => {
    render(
      <React.StrictMode>
        <RouterProvider router={router} />
      </React.StrictMode>
    );
    expect(initialUserList.length).toBe(11);

    const firstUser = initialUserList[0];
    const allCardsWithSameName = screen.getAllByText(firstUser.username);
    const actualFirstUser = allCardsWithSameName[0];

    const deleteButton = actualFirstUser.parentElement?.querySelector('svg.delete-btn');

    expect(deleteButton).toBeInTheDocument();

  
    fireEvent.click(deleteButton!);

    expect(initialUserList.length).toBe(10);

  });

  it("Should update first user name", async () => {
    render(
      <React.StrictMode>
        <RouterProvider router={router} />
      </React.StrictMode>
    );

    const firstUser = initialUserList[0];
    const allCardsWithSameName = screen.getAllByText(firstUser.username);
    const actualFirstUser = allCardsWithSameName[0];

    const updateButton = actualFirstUser.parentElement?.querySelector('svg.update-btn');
    const newUserName = "cosmin";

    act(() => {
      fireEvent.click(updateButton!);
    });


    await act(async () => { });

    const inputUsername = screen.getByTestId('input-username-update');
    const submitButton = screen.getByTestId('submit-update-btn');

    act(() => {
      fireEvent.change(inputUsername, { target: { value: newUserName } });
      fireEvent.click(submitButton);
    }
    );

    await act(async () => { });

    expect(initialUserList[0].username).toBe(newUserName);

    /// return to home page
    const link = screen.getByTestId('link-home-page');
    act(() => {
      fireEvent.click(link);
    });
  });


  it("Should add a new user", async () => {
    render(
      <React.StrictMode>
        <RouterProvider router={router} />
      </React.StrictMode>
    );
    
    // go to add user page
    const link = screen.getByTestId('add-new-user-page');
    act(() => {
      fireEvent.click(link);
    });

    const inputUserid = screen.getByTestId('input-userid');
    const inputUsername = screen.getByTestId('input-username');
    const inputEmail = screen.getByTestId('input-email');
    const inputPassword = screen.getByTestId('input-password');
    const inputAvatar = screen.getByTestId('input-avatar');
    const inputGrade = screen.getByTestId('input-grade');
    const inputAddress = screen.getByTestId('input-address');
    const submitButton = screen.getByTestId('submit-add-btn');


    act(() => {
      fireEvent.change(inputUserid, { target: { value: "123" } });
      fireEvent.change(inputUsername, { target: { value: "cosmin" } });
      fireEvent.change(inputEmail, { target: { value: "test@gmail.com" } });
      fireEvent.change(inputPassword, { target: { value: "1234" } });
      fireEvent.change(inputAvatar, { target: { value: "test" } });
      fireEvent.change(inputGrade, { target: { value: "7.5" } });
      fireEvent.change(inputAddress, { target: { value: "test" } });
      fireEvent.click(submitButton);
    }
    );

    await act(async () => { });
  
    expect(initialUserList.length).toBe(11);

    /// return to home page
    const linkHomePage = screen.getByTestId('link-home-page');
    act(() => {
      fireEvent.click(linkHomePage);
    });
  });

  it("test search filter", async () => {
    render(
      <React.StrictMode>
        <RouterProvider router={router} />
      </React.StrictMode>
    );

    const input = screen.getByTestId('search-test');

    const firstUserName = initialUserList[0].username;

    act(() => {
      fireEvent.change(input, { target: { value: firstUserName } });
    });

    await act(async () => { });

    const firstPage = initialUserList.slice(0, 4);
    const filteredList = firstPage.filter(user => user.username.includes(firstUserName));

    const cards = screen.getAllByTestId('carousel-card-test');
    expect(cards.length).toBe(filteredList.length*2);
  
  });


  it("test pagination", async () => {
    render(
      <React.StrictMode>
        <RouterProvider router={router} />
      </React.StrictMode>
    );

    const currentPage = screen.getByTestId('page-number');
    expect(currentPage.textContent).toBe("Page: 1");
    expect(initialUserList.length).toBeGreaterThanOrEqual(8);

    let cards = screen.getAllByTestId('carousel-card-test');
    expect(cards.length).toBe(10);
    expect(screen.getAllByText(initialUserList[0].username)[0]).toBeInTheDocument();
    expect(screen.getAllByText(initialUserList[1].username)[0]).toBeInTheDocument();
    expect(screen.getAllByText(initialUserList[2].username)[0]).toBeInTheDocument();
    expect(screen.getAllByText(initialUserList[3].username)[0]).toBeInTheDocument();
    expect(screen.getAllByText(initialUserList[4].username)[0]).toBeInTheDocument();
   
    const nextButton = screen.getByTestId('next-btn');
  
    act(() => {
      fireEvent.click(nextButton);
    });

    await act(async () => { });

    expect(currentPage.textContent).toBe("Page: 2");
    cards = screen.getAllByTestId('carousel-card-test');
    expect(cards.length).toBe(10);
    expect(screen.getAllByText(initialUserList[5].username)[0]).toBeInTheDocument();
    expect(screen.getAllByText(initialUserList[6].username)[0]).toBeInTheDocument();
    expect(screen.getAllByText(initialUserList[7].username)[0]).toBeInTheDocument();
    expect(screen.getAllByText(initialUserList[8].username)[0]).toBeInTheDocument();
    expect(screen.getAllByText(initialUserList[9].username)[0]).toBeInTheDocument();


    const prevButton = screen.getByTestId('prev-btn');

    act(() => {
      fireEvent.click(prevButton);
    }
    );

    await act(async () => { });

    expect(currentPage.textContent).toBe("Page: 1");
    expect(cards.length).toBe(10);
    expect(screen.getAllByText(initialUserList[0].username)[0]).toBeInTheDocument();
    expect(screen.getAllByText(initialUserList[1].username)[0]).toBeInTheDocument();
    expect(screen.getAllByText(initialUserList[2].username)[0]).toBeInTheDocument();
    expect(screen.getAllByText(initialUserList[3].username)[0]).toBeInTheDocument();
    expect(screen.getAllByText(initialUserList[4].username)[0]).toBeInTheDocument();



  });

  it("test bar chart", async () => {
    render(
      <React.StrictMode>
        <RouterProvider router={router} />
      </React.StrictMode>
    );

    const barChart = screen.getByTestId('bar-chart-test-id');
    expect(barChart).toBeInTheDocument();
    expect(barChart.querySelector('canvas')).toBeInTheDocument();
  });

  it("test dropdown", async () => {
    render(
      <React.StrictMode>
        <RouterProvider router={router} />
      </React.StrictMode>
    );

    let cards = screen.getAllByTestId('carousel-card-test');
    expect(cards.length).toBe(10);

    let dropdownBtn = screen.getByTestId('dropdown-btn-test-id');
    expect(dropdownBtn).toBeInTheDocument();
    expect(dropdownBtn.getAttribute('data-state')).toBe('closed');
    
    
    const user = userEvent.setup();

    await user.click(dropdownBtn);

    expect(dropdownBtn.getAttribute('data-state')).toBe('open');

    const dropdownItems = screen.getAllByTestId('dropdown-item-test-id');
    expect(dropdownItems.length).toBe(2);

    const dropdownItem = dropdownItems[1];
    expect(dropdownItem).toBeInTheDocument();

    await user.click(dropdownItem);

    cards = screen.getAllByTestId('carousel-card-test');
    expect(cards.length).toBe(20);
  }
  );

});