import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://whvxeqxmphvppdzamweg.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6IndodnhlcXhtcGh2cHBkemFtd2VnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzUyMTM5NzUsImV4cCI6MjA5MDc4OTk3NX0.J3b3A4pERp0K5eQFqsqfnTq20pCEmZCWjV4GvwDgBJ0';

const supabase = createClient(supabaseUrl, supabaseKey);

async function testAuth() {
    const { data, error } = await supabase.auth.signUp({
        email: 'test_node_auth@example.com',
        password: 'Password123!',
        options: {
            data: {
                full_name: 'Node Test'
            }
        }
    });

    if (error) {
        console.error('Signup Error:', error);
    } else {
        console.log('Signup Success:', data.user ? data.user.id : 'No user object');
    }
}

testAuth();
