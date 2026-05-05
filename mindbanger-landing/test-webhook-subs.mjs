import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.resolve('.env.local') });

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);

async function testSubscriptionCommission() {
  console.log('--- FETCHING AFFILIATE ---');
  const { data: affiliates, error: affErr } = await supabase.from('affiliates').select('*').limit(1);
  if (affErr || !affiliates.length) {
    console.error('No affiliate found:', affErr);
    return;
  }
  const affiliate = affiliates[0];
  console.log('Using affiliate ID:', affiliate.id);

  console.log('--- FETCHING USER ---');
  const { data: users, error: uErr } = await supabase.from('profiles').select('*').limit(2);
  const user = users.find(u => u.id !== affiliate.user_id) || users[0];
  console.log('Using simulated referee user ID:', user.id);

  const sessionId = 'test_sub_session_' + Date.now();
  const subKey = 'test_sub_' + Date.now();

  console.log('--- SIMULATING CHECKOUT.SESSION.COMPLETED (lifetime_20) ---');
  const amountTotal = 19.99;
  const commissionModel = 'lifetime_20';
  const commissionAmountVal = amountTotal * 0.20; // 3.998
  const initialStatus = 'pending';

  const { data, error } = await supabase.from('referrals').insert({
    affiliate_id: affiliate.id,
    referee_user_id: user.id || null, 
    commission_model: commissionModel,
    status: initialStatus,
    amount: commissionAmountVal,
    stripe_session_id: subKey,
  }).select();

  if (error) {
    console.error('ERROR inserting lifetime commission:', error);
  } else {
    console.log('SUCCESS! Inserted lifetime referral:', data);
  }

  console.log('\n--- SIMULATING CHECKOUT.SESSION.COMPLETED (second_month) ---');
  const subKey2 = 'test_sub_sm_' + Date.now();
  const smAmountTotal = 50.00;
  
  const { data: smData, error: smError } = await supabase.from('referrals').insert({
    affiliate_id: affiliate.id,
    referee_user_id: user.id || null, 
    commission_model: 'second_month',
    status: 'waiting_second_month',
    amount: smAmountTotal, // 100% amount for second month wait
    stripe_session_id: subKey2,
  }).select();

  if (smError) {
    console.error('ERROR inserting second_month commission:', smError);
  } else {
    console.log('SUCCESS! Inserted second_month referral:', smData);
  }
  
  console.log('\n--- SIMULATING INVOICE.PAID (second_month unlocked) ---');
  // Usually this unlocks the waiting_second_month
  const targetRef = smData[0];
  const { data: unlockData, error: unlockError } = await supabase.from('referrals').update({ status: 'pending' }).eq('id', targetRef.id).select();
  
  if (unlockError) {
    console.error('ERROR unlocking second_month:', unlockError);
  } else {
    console.log('SUCCESS! Unlocked second_month to pending:', unlockData);
  }

  console.log('\n--- SIMULATING INVOICE.PAID (lifetime recurring insert) ---');
  const invoiceAmount = 19.99;
  const loopComm = invoiceAmount * 0.20;
  const { data: recurData, error: recurError } = await supabase.from('referrals').insert({
    affiliate_id: affiliate.id,
    referee_user_id: user.id,
    commission_model: 'lifetime_20',
    status: 'pending',
    amount: loopComm,
    stripe_session_id: `invoice_test_${Date.now()}_${affiliate.id}`,
  }).select();

  if (recurError) {
    console.error('ERROR inserting lifetime recurrent:', recurError);
  } else {
    console.log('SUCCESS! Inserted lifetime recurrent commission:', recurData);
  }
}

testSubscriptionCommission();
