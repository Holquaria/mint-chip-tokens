const MintedGarment = ({ tokenStatus }) => {
    return       (
        tokenStatus === 'owned by user' ? (
          <p>Token registered. Would you like to manage ownership?</p>
        ) : (
          <p>Token is owned by *insert wallet address*, if this is you, please connect wallet.</p>
        )

      )
}

export default MintedGarment