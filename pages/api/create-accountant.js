import { createClient } from '@supabase/supabase-js';

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

export default async function handler(req, res) {
  if (req.method === 'POST') {
    const { email, username, password } = req.body;
    if (!email || !username || !password) {
      return res.status(400).json({ error: 'Email, username, and password are required' });
    }
    // Create user in Supabase Auth with accountant role and username
    const { data, error } = await supabaseAdmin.auth.admin.createUser({
      email,
      password,
      user_metadata: { role: 'accountant', username },
      email_confirm: true,
    });
    if (error) {
      return res.status(400).json({ error: error.message });
    }
    // Insert into profiles table
    const userId = data.user.id;
    const { error: profileError } = await supabaseAdmin
      .from('profiles')
      .insert([{ id: userId, email, username, role: 'accountant' }]);
    if (profileError) {
      return res.status(400).json({ error: profileError.message });
    }
    return res.status(200).json({ user: data.user });
  }
  if (req.method === 'DELETE') {
    const { id } = req.body;
    if (!id) {
      return res.status(400).json({ error: 'User id is required' });
    }
    // Delete from profiles table
    const { error: profileError } = await supabaseAdmin
      .from('profiles')
      .delete()
      .eq('id', id);
    if (profileError) {
      return res.status(400).json({ error: profileError.message });
    }
    // Delete from Supabase Auth
    const { error: authError } = await supabaseAdmin.auth.admin.deleteUser(id);
    if (authError) {
      return res.status(400).json({ error: authError.message });
    }
    return res.status(200).json({ success: true });
  }
  return res.status(405).json({ error: 'Method not allowed' });
} 