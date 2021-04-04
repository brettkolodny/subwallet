port module Main exposing (..)

import Browser
import Html exposing (Html, div, img, text, span)
import Html.Events exposing (onClick)
import Html.Attributes as Attr exposing (id, src, class)


-- MAIN

main : Program Assets Model Msg
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

-- MODEL
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
  }

type alias Model = 
  { assets : Assets
  , currentPage : CurrentPage
  , latestBlocks : Blocks
  , recentBlocks: List (String, String)
  }

init : Assets -> ( Model, Cmd Msg )
init assets =
  ( { assets = 
      { iconExplorer = assets.iconExplorer
      , iconWallet = assets.iconWallet
      , iconGovernance = assets.iconGovernance
      , iconContacts = assets.iconContacts
      }
    , currentPage = Explorer
    , latestBlocks =
      { latest = "Loading...", finalized = "Loading...", author = "" }
    , recentBlocks = []
    }
    , Cmd.none
  )


-- UPDATE

type Msg = 
  NoOp
  | WalletPage
  | ExplorerPage
  | ContactsPage
  | GovernancePage
  | NewBlock Blocks

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
        , recentBlocks = (blocks.latest, blocks.author) :: model.recentBlocks
        }
      , Cmd.none
      )


-- VIEW

view : Model -> Html Msg
view model =
  div [ id "app" ]
    [ viewSidebar model 
    , (case model.currentPage of
        Explorer -> viewExplorerPage model

        _ -> viewPage
      ) ]


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

viewPage : Html Msg
viewPage =
  div [ class "view" ] []


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
  div [ id "block-info" ] [ div [ id "recent-blocks" ] (viewRecentBlocks model.recentBlocks) ]

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
  |> List.take 6


-- SUBSCRIPTIONS

subscriptions : Model -> Sub Msg
subscriptions _ =
  newBlocks NewBlock