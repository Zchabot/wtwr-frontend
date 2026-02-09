import { useEffect, useState } from "react";
import { Routes, Route, useNavigate, useLocation } from "react-router-dom";
import "./App.css";
import Header from "../Header/Header";
import Main from "../Main/Main";
import ItemModal from "../ItemModal/ItemModal";
import { getWeather, filterWeatherData } from "../../utils/weatherApi";
import { coordinates, APIkey } from "../../utils/constants";
import Footer from "../Footer/Footer";
import { CurrentTemperatureUnitContext } from "../../contexts/CurrentTemperatureUnitContext";
import AddItemModal from "../AddItemModal/AddItemModal";
import Profile from "../Profile/Profile";
import {
  getItems,
  addItem,
  deleteItem,
  getUserInfo,
  updateUserInfo,
  addCardLike,
  removeCardLike,
} from "../../utils/api";
import ConfirmDeleteModal from "../ConfirmDeleteModal/ConfirmDeleteModal";
import RegisterModal from "../RegisterModal/RegisterModal";
import LoginModal from "../LoginModal/LoginModal";
import * as auth from "../../utils/auth";
import ProtectedRoute from "../ProtectedRoute/ProtectedRoute";
import CurrentUserContext from "../../contexts/CurrentUserContext";
import { setToken, getToken, removeToken } from "../../utils/token";
import EditProfileModal from "../EditProfileModal/EditProfileModal";

function App() {
  const [weatherData, setWeather] = useState({
    type: "",
    temp: { F: 999, C: 999 },
    city: "",
  });
  const [activeModal, setActiveModal] = useState("");
  const [selectedCard, setSelectedCard] = useState({});
  const [openMenu, setOpenMenu] = useState(false);
  const [currentTemperatureUnit, setCurrentTemperatureUnit] = useState("F");
  const [clothingItems, setClothingItems] = useState([]);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userData, setUserData] = useState({
    name: "empty",
    avatar: "empty",
  });
  const [hasAvatar, setHasAvatar] = useState(true);
  const [cardOwner, setCardOwner] = useState("");
  const [formError, setFormError] = useState({});
  const navigate = useNavigate();
  const location = useLocation();

  const setFormErrorMessage = ({ form, err }) => {
    if (err === "Error: 409") {
      setFormError({ ...formError, [form]: "This email is not available" });
    } else {
      if (err === "Error: 400") {
        setFormError({ ...formError, [form]: "Invalid data provided" });
      } else {
        if (err === "Error: 401") {
          setFormError({ ...formError, [form]: "Incorrect email or password" });
        } else {
          setFormError({
            ...formError,
            [form]: "An error has occurred on the server",
          });
        }
      }
    }
  };

  const handleOpenMenu = () => {
    setOpenMenu(true);
  };

  const handleCloseMenu = () => {
    setOpenMenu(false);
  };

  const handleCardClick = (card) => {
    setActiveModal("preview");
    setSelectedCard(card);
    if (card.owner && typeof card.owner !== "string") {
      setCardOwner(card.owner._id);
    } else {
      setCardOwner(card.owner);
    }
  };

  const handleOpenFormModal = (modal) => {
    setActiveModal(modal);
    setSubmitSuccess(false);
  };

  const handleDeleteClick = () => {
    handleOpenFormModal("delete");
  };

  const handleAddClick = () => {
    handleOpenFormModal("add-garment");
    handleCloseMenu();
  };

  const openProfileModal = () => {
    setActiveModal("edit-profile");
  };

  const openLoginModal = () => {
    handleOpenFormModal("log-in");
  };

  const openRegisterModal = () => {
    handleOpenFormModal("register");
  };

  const closeActiveModal = () => {
    setActiveModal("");
  };

  // UX: surface server-side validation/auth errors so users know what to fix
  function handleSubmit(request, form) {
    setIsLoading(true);
    request()
      .then(() => {
        closeActiveModal();
        setSubmitSuccess(true);
        setFormError({});
      })
      .catch((err) => {
        console.error;
        setFormErrorMessage({ form, err });
        console.log(form);
        console.log(err);
      })
      .finally(() => setIsLoading(false));
  }

  const handleToggleSwitchChange = () => {
    if (currentTemperatureUnit === "C") setCurrentTemperatureUnit("F");
    if (currentTemperatureUnit === "F") setCurrentTemperatureUnit("C");
  };

  const onAddItem = (newItem) => {
    const token = getToken();
    const makeRequest = () => {
      return addItem(newItem, token).then((res) => {
        setClothingItems([res, ...clothingItems]);
      });
    };
    handleSubmit(makeRequest);
  };

  const handleDeleteItem = (deletedItem) => {
    const token = getToken();
    const makeRequest = () => {
      return deleteItem(deletedItem._id, token).then(() => {
        const filteredItems = clothingItems.filter((item) => {
          return item._id !== deletedItem._id;
        });
        setClothingItems(filteredItems);
      });
    };
    handleSubmit(makeRequest);
  };

  const handleLogin = ({ email, password }, form) => {
    if (!email || !password) {
      return;
    }
    const makeRequest = () => {
      return auth.authorize({ email, password }).then((res) => {
        if (res.token) {
          setToken(res.token);
          setIsLoggedIn(true);
          getUserInfo(res.token).then((data) => {
            setUserData(data);
          });
          const redirectPath = location.state?.from?.pathname || "/";
          navigate(redirectPath);
        }
      });
    };
    handleSubmit(makeRequest, form);
  };

  const handleRegistration = (data, form) => {
    const makeRequest = () => {
      return auth.register(data).then(() => {
        handleLogin({ email: data.email, password: data.password });
      });
    };
    handleSubmit(makeRequest, form);
  };

  const handleLogOut = () => {
    removeToken();
    setIsLoggedIn(false);
    setUserData({
      name: "empty",
      avatar: "empty",
    });
    navigate("/");
  };

  const handleProfileUpdate = (data) => {
    const token = getToken();
    const makeRequest = () => {
      return updateUserInfo(data, token).then((res) => {
        setUserData(res.data);
      });
    };
    handleSubmit(makeRequest);
  };

  const replaceLikedItem = (newItem, cardId) => {
    const oldItem = clothingItems.findIndex((item) => {
      return item._id === cardId;
    });
    const item = newItem.data ? newItem.data : newItem;
    let newClothingItems = clothingItems;
    newClothingItems[oldItem] = item;
    setClothingItems(newClothingItems);
  };

  const handleCardLike = ({ cardId, isLiked, setIsLiked }) => {
    const token = getToken();
    !isLiked
      ? addCardLike(cardId, token)
          .then((newItem) => {
            setIsLiked(true);
            replaceLikedItem(newItem, cardId);
          })
          .catch((err) => console.log(err))
      : removeCardLike(cardId, token)
          .then((newItem) => {
            setIsLiked(false);
            replaceLikedItem(newItem, cardId);
          })
          .catch(console.error);
  };

  const handleLoginButton = () => {
    setActiveModal("log-in");
  };

  const handleSignupButton = () => {
    setActiveModal("register");
  };

  // Initial load: restore auth session (if token exists) and fetch user + items
  useEffect(() => {
    const jwt = getToken();

    if (!jwt) {
      return;
    }
    getUserInfo(jwt)
      .then((data) => {
        setUserData(data);
        setIsLoggedIn(true);
      })
      .catch(console.error);
  }, []);

  useEffect(() => {
    getWeather(coordinates, APIkey)
      .then((data) => {
        const filteredData = filterWeatherData(data);
        setWeather(filteredData);
      })
      .catch(console.error);
  }, []);

  useEffect(() => {
    getItems()
      .then((data) => {
        setClothingItems(data.reverse());
      })
      .catch(console.error);
  }, []);

  useEffect(() => {
    if (!userData.avatar) {
      setHasAvatar(false);
    } else {
      setHasAvatar(true);
    }
  });

  return (
    <CurrentUserContext.Provider
      value={{
        userData,
        setIsLoggedIn,
        isLoggedIn,
        hasAvatar,
        setHasAvatar,
        handleCardLike,
        clothingItems,
        formError,
        setFormError,
      }}
    >
      <div className="page">
        <CurrentTemperatureUnitContext.Provider
          value={{ currentTemperatureUnit, handleToggleSwitchChange }}
        >
          <div className="page__content">
            <Header
              handleAddClick={handleAddClick}
              weatherData={weatherData}
              handleOpenMenu={handleOpenMenu}
              handleCloseMenu={handleCloseMenu}
              openMenu={openMenu}
              openLoginModal={openLoginModal}
              openRegisterModal={openRegisterModal}
            />
            <Routes>
              <Route
                path="/"
                element={
                  <Main
                    weatherData={weatherData}
                    handleCardClick={handleCardClick}
                    clothingItems={clothingItems}
                    setClothingItems={setClothingItems}
                  />
                }
              />
              <Route
                path="/profile"
                element={
                  <ProtectedRoute>
                    <Profile
                      onCardClick={handleCardClick}
                      clothingItems={clothingItems}
                      handleAddClick={handleAddClick}
                      weatherData={weatherData}
                      openProfileModal={openProfileModal}
                      handleLogOut={handleLogOut}
                    />
                  </ProtectedRoute>
                }
              />
            </Routes>
            <Footer />
          </div>
          <AddItemModal
            isOpen={activeModal === "add-garment"}
            onClose={closeActiveModal}
            onAddItem={onAddItem}
            submitSuccess={submitSuccess}
            isLoading={isLoading}
            setIsLoading={setIsLoading}
          />
          <ItemModal
            isOpen={activeModal === "preview"}
            onClose={closeActiveModal}
            card={selectedCard}
            handleDeleteClick={handleDeleteClick}
            cardOwner={cardOwner}
          />
          <ConfirmDeleteModal
            card={selectedCard}
            isOpen={activeModal === "delete"}
            onClose={closeActiveModal}
            handleDeleteItem={handleDeleteItem}
            isLoading={isLoading}
            setIsLoading={setIsLoading}
          />
          <RegisterModal
            isOpen={activeModal === "register"}
            onClose={closeActiveModal}
            submitSuccess={submitSuccess}
            isLoading={isLoading}
            setIsLoading={setIsLoading}
            handleRegistration={handleRegistration}
            handleLoginButton={handleLoginButton}
          />
          <LoginModal
            isOpen={activeModal === "log-in"}
            onClose={closeActiveModal}
            submitSuccess={submitSuccess}
            isLoading={isLoading}
            setIsLoading={setIsLoading}
            handleLogin={handleLogin}
            handleSignupButton={handleSignupButton}
          />
          <EditProfileModal
            isOpen={activeModal === "edit-profile"}
            onClose={closeActiveModal}
            isLoading={isLoading}
            setIsLoading={setIsLoading}
            handleProfileUpdate={handleProfileUpdate}
          />
        </CurrentTemperatureUnitContext.Provider>
      </div>
    </CurrentUserContext.Provider>
  );
}

export default App;
