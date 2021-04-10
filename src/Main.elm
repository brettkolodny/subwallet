port module Main exposing (..)

import Browser
import Html exposing (Html, div, img, text, span)
import Html.Keyed as Keyed
import Html.Lazy exposing (lazy)
import Html.Events exposing (onClick)
import Html.Attributes exposing (id, src, class)


-- MAIN

main : Program Flags Model Msg
main =
  Browser.element
    { init = init
    , view = view
    , update = update
    , subscriptions = subscriptions
    }


-- PORTS
type alias Blocks = { latest : String, finalized : String, author : String }

port newBlocks : (Blocks -> msg) -> Sub msg

port newEvents : ((List Event) -> msg) -> Sub msg

port changeNetwork : String -> Cmd msg

port networkChanged : (Int -> msg) -> Sub msg

port changeAccount : String -> Cmd msg

port balanceChange : (String -> msg) -> Sub msg

port initialized : String -> Cmd msg

-- SUBSCRIPTIONS

subscriptions : Model -> Sub Msg
subscriptions _ =
  Sub.batch 
    [ newBlocks NewBlock 
    , newEvents NewEvents
    , balanceChange BalanceChange
    , networkChanged NetworkChanged
    ]


-- MODEL

type alias Network = 
  { name : String
  , endpoint : String
  , genesisHash : String
  , logo : String
  }

type alias Account =
  { name : String
  , genesisHash : String
  , address : String
  }

type alias Event = 
  { to: String
  , from: String
  , amount: String
  , key: String
  }

type CurrentPage = 
  Explorer
  | Wallet
  | Contacts
  | Governance

type alias Assets = 
  { iconExplorer : String
  , iconWallet : String 
  , iconGovernance : String
  , iconContacts : String 
  , iconNotification : String
  }

type alias Flags =
  { assets : Assets
  , networks : List Network
  , accounts : List Account
  }

type alias Model = 
  { assets : Assets
  , currentPage : CurrentPage
  , latestBlocks : Blocks
  , recentBlocks: List (String, String)
  , events : List Event
  , showNetworks : Bool
  , networks : List Network
  , currentNetwork : Network
  , accounts : List Account
  , currentAccount : Maybe Account
  , currentBalance : Maybe String
  , showAccounts : Bool
  }

init : Flags -> ( Model, Cmd Msg )
init flags =
  ( { assets = flags.assets
    , currentPage = Explorer
    , latestBlocks =
      { latest = "Loading...", finalized = "Loading...", author = "" }
    , recentBlocks = []
    , events = []
    , showNetworks = False
    , networks = flags.networks
    , currentNetwork = 
        case List.head flags.networks of
          Just n -> n
          Nothing -> { name = "", endpoint = "", logo = "", genesisHash = ""}
    , accounts = flags.accounts
    , currentAccount = getCurrentAccount flags.networks flags.accounts
    , showAccounts = False
    , currentBalance = Nothing
    }
    , initialized
        (case getCurrentAccount flags.networks flags.accounts of
           Just a -> a.address
           Nothing -> "")
  )

getCurrentAccount : List Network -> List Account -> Maybe Account
getCurrentAccount networks accounts =
  Maybe.andThen 
    (\n -> 
      List.filter (\account -> account.genesisHash == n.genesisHash || account.genesisHash == "") accounts
      |> List.head
    ) 
    (List.head networks)


-- UPDATE

type Msg = 
  NoOp
  | WalletPage
  | ExplorerPage
  | ContactsPage
  | GovernancePage
  | NewBlock Blocks
  | NewEvents (List Event)
  | ToggleNetworks
  | SwitchNetwork Network
  | ToggleAccounts
  | SetCurrentAccount Account
  | BalanceChange String
  | NetworkChanged Int

update : Msg -> Model -> ( Model, Cmd Msg )
update msg model =
  case msg of
    NoOp -> ( model, Cmd.none )

    ExplorerPage ->
      ( { model | currentPage = Explorer }
      , Cmd.none
      )

    WalletPage ->
      ( { model | currentPage = Wallet }
      , Cmd.none
      )

    ContactsPage ->
      ( { model | currentPage = Contacts }
      , Cmd.none
      )

    GovernancePage ->
      ( { model | currentPage = Governance }
      , Cmd.none
      )
    
    NewBlock blocks ->
      ( { model | latestBlocks = 
          { latest = blocks.latest
          , finalized = blocks.finalized 
          , author = ""
          }
        , recentBlocks = 
            (blocks.latest, blocks.author) :: model.recentBlocks
            |> List.take 6
        }
      , Cmd.none
      )

    NewEvents events ->
      ( { model | events = events ++ model.events |> List.take 5 }
      , Cmd.none
      )

    ToggleNetworks ->
      ( { model | showNetworks = not model.showNetworks }
      , Cmd.none
      )

    SwitchNetwork network ->
      if model.currentNetwork == network then
        ( { model | showNetworks = False }, Cmd.none )
      else
        ( { model | currentNetwork = network
          , events = []
          , latestBlocks = 
            { latest = "Loading...", finalized = "Loading...", author = "" }
          , recentBlocks = []
          , showNetworks = False
          , currentAccount = getCurrentAccount [network] model.accounts
          , currentBalance = Nothing
          }
        , changeNetwork network.endpoint
        )
        
    ToggleAccounts ->
      ( { model | showAccounts = not model.showAccounts }
      , Cmd.none
      )

    SetCurrentAccount account ->
      ( { model | currentAccount = Just account 
        , showAccounts = False
        , currentBalance = Nothing
        }
      , changeAccount account.address
      )

    BalanceChange balance ->
      ( { model | currentBalance = Just balance }
      , Cmd.none
      )

    NetworkChanged _ ->
      ( model
      , changeAccount (case model.currentAccount of
          Just a -> a.address
          Nothing -> "")
      )

-- VIEW

view : Model -> Html Msg
view model =
  div [ id "app" ]
    [ lazy viewNetworkSwitcher model
    , viewAccountPicker model
    , lazy viewSidebar model 
    , viewCurrentPage model
    ]

viewCurrentPage : Model -> Html Msg
viewCurrentPage model =
  case model.currentPage of
    Explorer -> viewExplorerPage model

    _ -> div [ class "view" ] []

-- SIDEBAR VIEW

viewSidebar : Model -> Html Msg
viewSidebar model =
  div [ id "sidebar" ]
    [ img 
      [ src model.assets.iconExplorer
      , class (selected Explorer model)
      , onClick ExplorerPage 
      ] 
      [] 
    , img 
      [ src model.assets.iconWallet
      , class (selected Wallet model)
      , onClick WalletPage 
      ] 
      [] 
    , img 
      [ src model.assets.iconContacts
      , class (selected Contacts model) 
      , onClick ContactsPage 
      ] 
      []
    , img 
      [ src model.assets.iconGovernance
      , class (selected Governance model) 
      , onClick GovernancePage 
      ] 
      [] 
    ]

selected : CurrentPage -> Model -> String
selected currentPage model =
  if model.currentPage == currentPage then
    "selected"
  else
    ""


-- EXPLORER VIEW

viewExplorerPage : Model -> Html Msg
viewExplorerPage model =
  div 
    [ id "explorer", class "view" ] 
    [ viewLatestBlocks model
    , viewBlockInfo model
    ]

viewBlockInfo : Model -> Html Msg
viewBlockInfo model =
  div 
  [ id "block-info" ] 
    [ div 
      [ id "recent-blocks" ] 
      (viewRecentBlocks model.recentBlocks) 
    , viewEvents model
    ]

viewLatestBlocks : Model -> Html Msg
viewLatestBlocks model =
  div 
    [ id "block-numbers-container" ]
    [ div 
      [ id "block-numbers" ] 
      [ div 
        [ class "block-number" ] 
        [ text model.latestBlocks.latest
        , span [ class "label" ] [ text " latest" ] ]
      , div 
        [ class "block-number" ] 
        [ text model.latestBlocks.finalized
        , span [ class "label" ] [ text " finalized" ] ]
      ]
    ]

viewRecentBlocks : List (String, String) -> List (Html Msg)
viewRecentBlocks recentBlocks =
  List.map 
    (\blockInfo -> 
      div 
        [ class "block" ] 
        [ div [ class "block-number" ] [ text (Tuple.first blockInfo) ]
        , div [ class "address" ] [ text (Tuple.second blockInfo) ]
        ]
    ) 
    recentBlocks

viewEvents : Model -> Html Msg
viewEvents model =
  Keyed.node 
    "div" 
    [ id "recent-events" ] 
    ( List.map 
      ( viewEvent model.assets.iconNotification ) 
      model.events 
    )

viewEvent : String -> Event -> (String, Html Msg)
viewEvent srcString event =
  ( event.key
  , div
    [ class "event" ]
    [ img [ src srcString ] []
    , div
        [ class "event-details" ]
        [ div 
            [ class "event-name" ] 
            [ text "Transfer: "
            , span 
                [ class "amount" ] 
                [ text event.amount ] 
            ]
        , div [ class "event-data" ] [ text event.to ] 
        , div [ class "event-data" ] [ text event.from ]
        ]
    ]
  )


-- NETWORK VIEW

viewNetworkSwitcher : Model -> Html Msg
viewNetworkSwitcher model =
  div 
    [ id "network-picker" ]
    [ img
      [ src model.currentNetwork.logo
      , onClick ToggleNetworks
      ]
      []
    , ( if model.showNetworks then 
          viewNetworkList model
        else
          div [] []
      )
    ]

viewNetworkList : Model -> Html Msg
viewNetworkList model =
  div 
    [ id "network-list" ]
      ( List.map 
        (\network -> 
          img 
            [ src network.logo 
            , onClick (SwitchNetwork network)
            ] 
            []
        )
        model.networks
    )


-- Account View
viewAccountPicker : Model -> Html Msg
viewAccountPicker model =
  div 
    [ id "account-picker" ] 
    [ div
      [ id "current-account" 
      , onClick ToggleAccounts
      ] 
      [ div 
        [ id "balance" ] [ getBalance model.currentBalance |> text ] 
      , div 
        [ id "account-info"] 
        [ text 
            (case model.currentAccount of
              Just account -> account.name
              Nothing -> "No Accounts"
            )
        ]
      ]
    , if model.showAccounts then
        viewAccountsList model
      else
        div [] []
    ]

getBalance : Maybe String -> String
getBalance balance =
  case balance of
     Just b -> b
     Nothing -> "..."

viewAccountsList : Model -> Html Msg
viewAccountsList model =
  div 
  [ id "account-list" ]
  ( ( List.filter 
      ( \account ->
          account.genesisHash == model.currentNetwork.genesisHash || account.genesisHash == ""
      )
      model.accounts
    )
  |> List.map 
    ( \account -> 
        div 
          [ class "account-card" 
          , onClick (SetCurrentAccount account)
          ] 
          [ text account.name ]
    )
  )