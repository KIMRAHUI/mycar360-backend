const express = require('express');
const router = express.Router();
const supabase = require('../supabaseClient'); 

// GET /api/users/:id
router.get('/:id', async (req, res) => {
  const { id } = req.params;

  try {
    const { data, error } = await supabase
      .from('users')
      .select('address')
      .eq('id', Number(id))
      .single();

    if (error) throw error;
    res.json({ address: data.address });
  } catch (err) {
    console.error('❌ 사용자 주소 조회 실패:', err);
    res.status(500).json({ error: '주소 조회 실패' });
  }
});

module.exports = router;
