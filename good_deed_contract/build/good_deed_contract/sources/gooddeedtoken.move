module good_deed_contract::gooddeedtoken {

    use good_deed_contract::allowlist_rule;
    use sui::token;
    use sui::coin;

    // One Time Witness
    public struct GOODDEEDTOKEN has drop {}
    
    fun init(witness: GOODDEEDTOKEN, ctx: &mut TxContext) {

        let decimals: u8 = 9;
        let symbol: vector<u8> = b"GD";
        let name: vector<u8> = b"Good Deed Token";
        let description: vector<u8> = b"Good Deed Network Token (closed loop token)";

        let (treasury_cap, metadata) = coin::create_currency(witness, decimals, symbol, name, description, option::none(), ctx);
        
        let (mut token_policy, token_policy_cap) = token::new_policy(&treasury_cap, ctx);
        // token::disallow(&mut token_policy, &token_policy_cap, token::to_coin_action(), ctx);
        // token::disallow(&mut token_policy, &token_policy_cap, token::from_coin_action(), ctx);
        // token::disallow(&mut token_policy, &token_policy_cap, token::transfer_action(), ctx);

        token::allow(&mut token_policy, &token_policy_cap, token::spend_action(), ctx);

        token::add_rule_for_action<GOODDEEDTOKEN, allowlist_rule::Allowlist>(&mut token_policy, &token_policy_cap, token::transfer_action(), ctx);

        let mut approve_addresses: vector<address> = vector::empty();
        vector::push_back(&mut approve_addresses, tx_context::sender(ctx));
        allowlist_rule::add_records(&mut token_policy, &token_policy_cap, approve_addresses, ctx);
        token::share_policy(token_policy);

        transfer::public_transfer(token_policy_cap, tx_context::sender(ctx));

        transfer::public_freeze_object(metadata);
        transfer::public_transfer(treasury_cap, tx_context::sender(ctx));
    }

    public fun mint_and_transfer_with_cap<T> (
        token_policy: &token::TokenPolicy<T>, 
        treasury_cap: &mut coin::TreasuryCap<T>, 
        amount: u64, recipient: address, 
        ctx: &mut TxContext
    ) {
        let mint_token = token::mint(treasury_cap, amount, ctx);
        let mut req = token::transfer(mint_token, recipient, ctx);
        allowlist_rule::verify(token_policy, &mut req, ctx);
        token::confirm_request(token_policy, req, ctx);
    }

    public fun transfer<T>(t: token::Token<T>, recipient: address, ctx: &mut TxContext): token::ActionRequest<T> {
        token::transfer(t, recipient, ctx)
    }

    public fun spend<T>(t: token::Token<T>, ctx: &mut TxContext): token::ActionRequest<T> {
        token::spend(t, ctx)
    }

    public fun burn<T>(treasury_cap: &mut coin::TreasuryCap<T>, token: token::Token<T>) {
        token::burn(treasury_cap, token);
    }

    public fun add_approve_address_from_cap<T>(token_policy: &mut token::TokenPolicy<T>, token_policy_cap: &token::TokenPolicyCap<T>, approve_addresses: vector<address>, ctx: &mut TxContext) {
        allowlist_rule::add_records(token_policy, token_policy_cap, approve_addresses, ctx);
    }



    // #[test_only]
    // public fun init_for_testing(ctx: &mut TxContext) {
    //     init(ctx);
    // }

    // #[test_only]
    // use sui::test_scenario;

    // #[test]
    // public fun getAuthorizedAddressList() {
    //     let (sender1, sender2, sender3) = (@0x1, @0x2, @0x3);

    //     let mut scenario = test_scenario::begin(sender1);
    //     {
    //         init_for_testing(scenario.ctx());
    //     };

    //     let is_empty = vector::is_empty(&authorized.authorize_addresses);
    //     debug::print(&is_empty);
    // }
}