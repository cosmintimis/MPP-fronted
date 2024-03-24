import { describe, it, expect } from "vitest";
import { act, fireEvent, render, screen } from "@testing-library/react";
import React from "react";
import App from "./App";
import { RouterProvider, createBrowserRouter } from "react-router-dom";
import UpdatePage from "./pages/update-page";
import AddUserPage from "./pages/add-user-page";
import { USERS as initialUserList } from "@/constants/user";

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

// Tests
describe("Test CRUD", async () => {


  it("Should delete first user", async () => {
    render(
      <React.StrictMode>
        <RouterProvider router={router} />
      </React.StrictMode>
    );
    expect(initialUserList.length).toBe(8);

    const firstUser = initialUserList[0];
    const allCardsWithSameName = screen.getAllByText(firstUser.username);
    const actualFirstUser = allCardsWithSameName[0];

    const deleteButton = actualFirstUser.parentElement?.querySelector('svg.delete-btn');

    expect(deleteButton).toBeInTheDocument();

  
    fireEvent.click(deleteButton!);

    expect(initialUserList.length).toBe(7);

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
  
    expect(initialUserList.length).toBe(8);

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

    
    act(() => {
      fireEvent.change(input, { target: { value: "Darius Hantig" } });
    });

    await act(async () => { });

    const filteredList = initialUserList.filter(user => user.username.includes("Darius Hantig"));

    const cards = screen.getAllByTestId('carousel-card-test');
    expect(cards.length).toBe(filteredList.length*2);
  
  });
});